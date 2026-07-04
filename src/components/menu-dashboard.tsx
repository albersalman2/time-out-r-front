"use client";

<<<<<<< HEAD
import Link from "next/link";
=======
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
import { useMemo, useState } from "react";
import { formatEuro } from "@/lib/order-menu";
import type { DashboardMenuItem } from "@/lib/menu-store";

function centsToEuroInput(cents: number) {
  return (cents / 100).toFixed(2);
}

function euroInputToCents(value: string) {
  const normalized = value.replace(",", ".");
  const parsed = Number.parseFloat(normalized);

  if (Number.isNaN(parsed)) {
    return 0;
  }

  return Math.round(parsed * 100);
}

export function MenuDashboard({ initialItems }: { initialItems: DashboardMenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [savingId, setSavingId] = useState("");
<<<<<<< HEAD
=======
  const [uploadingId, setUploadingId] = useState("");
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
  const [message, setMessage] = useState("");

  const filteredItems = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.sectionTitle.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search),
    );
  }, [items, query]);

  function updateItem(id: string, patch: Partial<DashboardMenuItem>) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }

  function updateOption(
    itemId: string,
    optionId: string,
    patch: Partial<DashboardMenuItem["options"][number]>,
  ) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId
          ? {
              ...item,
              options: item.options.map((option) =>
                option.id === optionId ? { ...option, ...patch } : option,
              ),
            }
          : item,
      ),
    );
  }

  async function saveItem(item: DashboardMenuItem) {
    setSavingId(item.id);
    setMessage("");

    try {
      const response = await fetch(`/api/menu/items/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          isAvailable: item.isAvailable,
          options: item.options.map((option) => ({
            id: option.id,
            label: option.label,
            priceLabel: option.priceLabel,
            priceCents: option.priceCents,
            isAvailable: option.isAvailable,
          })),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Menu item could not be saved.");
      }

      setItems(payload.items);
      setMessage(`Saved ${item.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menu item could not be saved.");
    } finally {
      setSavingId("");
    }
  }

  async function seedMenu() {
    setSavingId("seed");
    setMessage("");

    try {
      const response = await fetch("/api/menu/seed", { method: "POST" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Menu could not be seeded.");
      }

      const menuResponse = await fetch("/api/menu");
      const menuPayload = await menuResponse.json();
      setItems(menuPayload.items);
      setMessage(
        `Menu synced: ${payload.result.sections} sections, ${payload.result.items} items, ${payload.result.options} options.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Menu could not be seeded.");
    } finally {
      setSavingId("");
    }
  }

<<<<<<< HEAD
=======
  async function uploadImage(item: DashboardMenuItem, file: File | undefined) {
    if (!file) {
      return;
    }

    setUploadingId(item.id);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`/api/menu/items/${item.id}/image`, {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Image could not be uploaded.");
      }

      setItems(payload.items);
      setMessage(`Uploaded image for ${item.name}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Image could not be uploaded.");
    } finally {
      setUploadingId("");
    }
  }

>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
  return (
    <section className="bg-[#f7f2e8] px-4 py-10 text-[#10100f] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-[#f25a1d]">Backend dashboard</p>
            <h1 className="mt-2 text-4xl font-black">Menu management</h1>
            <p className="mt-2 text-sm font-semibold text-[#6c6255]">
              Edit database-backed menu items used by the online order flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
<<<<<<< HEAD
            <Link
              href="/admin/orders"
              className="inline-flex h-11 items-center justify-center rounded-md border border-[#10100f] px-4 text-sm font-black"
            >
              Orders
            </Link>
            <Link
              href="/nl/menu"
              className="inline-flex h-11 items-center justify-center rounded-md bg-[#10100f] px-4 text-sm font-black text-white"
            >
              Customer menu
            </Link>
=======
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
            <button
              type="button"
              onClick={seedMenu}
              disabled={savingId === "seed"}
              className="h-11 rounded-md bg-[#f25a1d] px-4 text-sm font-black text-[#10100f] disabled:cursor-not-allowed disabled:bg-[#d2c8bd]"
            >
              {savingId === "seed" ? "Syncing..." : "Sync current menu"}
            </button>
          </div>
        </div>

        <div className="mb-5 flex flex-col gap-3 rounded-md border border-[#eadfcb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-black">{items.length} menu items in database</p>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search menu"
            className="h-11 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d] sm:w-80"
          />
        </div>

        {message ? (
          <div className="mb-5 rounded-md border border-[#eadfcb] bg-white p-4 text-sm font-semibold text-[#10100f]">
            {message}
          </div>
        ) : null}

        <div className="grid gap-4">
          {filteredItems.length ? (
            filteredItems.map((item) => (
              <article key={item.id} className="rounded-md border border-[#eadfcb] bg-white p-5 shadow-sm">
<<<<<<< HEAD
                <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
=======
                <div className="grid gap-4 lg:grid-cols-[140px_1fr_160px]">
                  <div>
                    <div className="aspect-square overflow-hidden rounded-md border border-[#eadfcb] bg-[#f7f2e8]">
                      {item.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                      ) : (
                        <div className="grid size-full place-items-center px-3 text-center text-xs font-black uppercase text-[#6c6255]">
                          No photo
                        </div>
                      )}
                    </div>
                    <label className="mt-2 block">
                      <span className="sr-only">Upload image for {item.name}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        disabled={uploadingId === item.id}
                        onChange={(event) => uploadImage(item, event.target.files?.[0])}
                        className="block w-full text-xs font-semibold file:mr-2 file:rounded-md file:border-0 file:bg-[#10100f] file:px-3 file:py-2 file:text-xs file:font-black file:text-white"
                      />
                    </label>
                    {uploadingId === item.id ? (
                      <p className="mt-2 text-xs font-black text-[#f25a1d]">Uploading...</p>
                    ) : null}
                  </div>
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
                  <div className="grid gap-3 md:grid-cols-2">
                    <label>
                      <span className="text-xs font-black uppercase text-[#6c6255]">
                        {item.sectionTitle}
                      </span>
                      <input
                        value={item.name}
                        onChange={(event) => updateItem(item.id, { name: event.target.value })}
                        className="mt-1 h-11 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-black outline-none focus:border-[#f25a1d]"
                      />
                    </label>
                    <label>
                      <span className="text-xs font-black uppercase text-[#6c6255]">Description</span>
                      <input
                        value={item.description ?? ""}
                        onChange={(event) => updateItem(item.id, { description: event.target.value })}
                        className="mt-1 h-11 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                      />
                    </label>
                  </div>
                  <div className="flex items-end gap-2 lg:justify-end">
                    <label className="flex h-11 items-center gap-2 rounded-md border border-[#eadfcb] px-3 text-sm font-black">
                      <input
                        type="checkbox"
                        checked={item.isAvailable}
                        onChange={(event) => updateItem(item.id, { isAvailable: event.target.checked })}
                      />
                      Available
                    </label>
                    <button
                      type="button"
                      onClick={() => saveItem(item)}
                      disabled={savingId === item.id}
                      className="h-11 rounded-md bg-[#10100f] px-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-[#a8a19a]"
                    >
                      {savingId === item.id ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 border-t border-[#eadfcb] pt-4 md:grid-cols-2 xl:grid-cols-3">
                  {item.options.map((option) => (
                    <div key={option.id} className="rounded-md border border-[#eadfcb] p-3">
                      <div className="grid grid-cols-[1fr_110px] gap-2">
                        <label>
                          <span className="text-xs font-black uppercase text-[#6c6255]">Option</span>
                          <input
                            value={option.label}
                            onChange={(event) =>
                              updateOption(item.id, option.id, { label: event.target.value })
                            }
                            className="mt-1 h-10 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                          />
                        </label>
                        <label>
                          <span className="text-xs font-black uppercase text-[#6c6255]">Price</span>
                          <input
                            value={centsToEuroInput(option.priceCents)}
                            onChange={(event) => {
                              const priceCents = euroInputToCents(event.target.value);
                              updateOption(item.id, option.id, {
                                priceCents,
                                priceLabel: formatEuro(priceCents),
                              });
                            }}
                            className="mt-1 h-10 w-full rounded-md border border-[#eadfcb] px-3 text-sm font-semibold outline-none focus:border-[#f25a1d]"
                          />
                        </label>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <span className="text-sm font-black">{formatEuro(option.priceCents)}</span>
                        <label className="flex items-center gap-2 text-sm font-black">
                          <input
                            type="checkbox"
                            checked={option.isAvailable}
                            onChange={(event) =>
                              updateOption(item.id, option.id, { isAvailable: event.target.checked })
                            }
                          />
                          Available
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-md border border-[#eadfcb] bg-white p-8 text-sm font-semibold text-[#6c6255]">
              No menu items found. Use Sync current menu to inject the static menu into the database.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
