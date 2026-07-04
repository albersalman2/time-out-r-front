import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { put } from "@vercel/blob";
import { slugify } from "@/lib/order-menu";

export type StoredImage = {
  url: string;
  key: string;
};

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function getS3Config() {
  const bucket = process.env.S3_BUCKET ?? process.env.R2_BUCKET;
  const region = process.env.S3_REGION ?? process.env.AWS_REGION ?? "auto";
  const endpoint = process.env.S3_ENDPOINT ?? process.env.R2_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID ?? process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey =
    process.env.S3_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY ?? process.env.R2_SECRET_ACCESS_KEY;
  const publicBaseUrl = process.env.S3_PUBLIC_BASE_URL ?? process.env.R2_PUBLIC_BASE_URL;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    return undefined;
  }

  return {
    bucket,
    region,
    endpoint,
    accessKeyId,
    secretAccessKey,
    publicBaseUrl,
  };
}

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

function extensionForType(contentType: string) {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return "jpg";
  }
}

function getStorageFolder() {
  if (process.env.STORAGE_ENV) {
    return slugify(process.env.STORAGE_ENV);
  }

  if (process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production") {
    return "production";
  }

  return "local";
}

export async function storeMenuImage(file: File, itemId: string): Promise<StoredImage> {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Upload a JPG, PNG, or WebP image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be 5MB or smaller.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `${getStorageFolder()}/menu/${slugify(itemId)}-${randomUUID()}.${extensionForType(file.type)}`;
  const blobToken = getBlobToken();
  const config = getS3Config();

  if (blobToken) {
    const blob = await put(key, buffer, {
      access: "public",
      contentType: file.type,
      token: blobToken,
      addRandomSuffix: false,
      cacheControlMaxAge: 31536000,
    });

    return {
      key: blob.pathname,
      url: blob.url,
    };
  }

  if (config) {
    const client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: Boolean(config.endpoint),
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    await client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    const url = config.publicBaseUrl
      ? `${config.publicBaseUrl.replace(/\/$/, "")}/${key}`
      : `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;

    return { key, url };
  }

  const relativePath = `/uploads/${key}`;
  const absolutePath = path.join(process.cwd(), "public", "uploads", key);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, buffer);

  return {
    key,
    url: relativePath,
  };
}
