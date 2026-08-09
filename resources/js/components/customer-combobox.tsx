import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CustomerOption {
  id: string | number;
  name: string;
  email: string;
}

interface CustomerComboboxProps {
  customers?: CustomerOption[];
  selectedCustomerId?: string;
  onSelectCustomer: (customerId: string) => void;
}

export function CustomerCombobox({
  customers = [],
  selectedCustomerId,
  onSelectCustomer,
}: CustomerComboboxProps) {
  const [customerList, setCustomerList] = useState<CustomerOption[]>(customers);
  const [value, setValue] = useState<string>(selectedCustomerId || "");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerEmail, setNewCustomerEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (customers && customers.length > 0) {
      setCustomerList(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (selectedCustomerId) {
      setValue(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  const handleSelect = (id: string) => {
    setValue(id);
    onSelectCustomer(id);
    setIsOpen(false);
  };

  const filteredCustomers = customerList.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCustomerObj = customerList.find((c) => String(c.id) === String(value));

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerEmail) return;

    setIsSaving(true);
    try {
      const response = await fetch("/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-TOKEN":
            (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || "",
        },
        body: JSON.stringify({
          name: newCustomerName,
          email: newCustomerEmail,
          password: "Password123!",
          password_confirmation: "Password123!",
          role: "CUSTOMER",
        }),
      });

      if (response.ok) {
        const json = await response.json();
        const createdCustomer = json.customer || json;
        const newObj: CustomerOption = {
          id: createdCustomer.id,
          name: createdCustomer.name,
          email: createdCustomer.email,
        };

        setCustomerList((prev) => [newObj, ...prev]);
        handleSelect(String(newObj.id));
        setIsQuickAddOpen(false);
        setNewCustomerName("");
        setNewCustomerEmail("");
      }
    } catch (err) {
      console.error("Failed to quick add customer", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <input type="hidden" name="customer_id" value={value} />

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between bg-card text-left font-normal"
          >
            {selectedCustomerObj ? (
              <span className="truncate">
                <span className="font-semibold text-foreground">{selectedCustomerObj.name}</span>
                <span className="text-xs text-muted-foreground ml-2">({selectedCustomerObj.email})</span>
              </span>
            ) : (
              <span className="text-muted-foreground">Select client account...</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>

          {isOpen && (
            <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-2 text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
              <Input
                placeholder="Search customer by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="mb-2 h-8 text-xs bg-muted/30"
              />

              <div className="max-h-48 overflow-y-auto space-y-1">
                {filteredCustomers.length === 0 ? (
                  <div className="p-3 text-xs text-center text-muted-foreground">
                    No customer match found.
                  </div>
                ) : (
                  filteredCustomers.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleSelect(String(c.id))}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-xs rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground",
                        String(value) === String(c.id) && "bg-accent/60 font-semibold"
                      )}
                    >
                      <div className="truncate">
                        <div className="font-medium text-foreground">{c.name}</div>
                        <div className="text-[11px] text-muted-foreground">{c.email}</div>
                      </div>
                      {String(value) === String(c.id) && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setIsQuickAddOpen(true)}
          className="gap-1 whitespace-nowrap text-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          Quick Add
        </Button>
      </div>

      {/* [+ Quick Add Customer] Modal */}
      <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              Quick Add Client
            </DialogTitle>
            <DialogDescription>
              Create a new customer profile on the fly for this booking.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleQuickAdd} className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Client / Company Name *</label>
              <Input
                placeholder="e.g. Acme Logistics Corp"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Contact Email *</label>
              <Input
                type="email"
                placeholder="contact@acme.com"
                value={newCustomerEmail}
                onChange={(e) => setNewCustomerEmail(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsQuickAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save & Tag"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
