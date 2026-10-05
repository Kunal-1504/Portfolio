"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({
  children,
  wide = false,
  appearance = "default",
}: {
  children: React.ReactNode;
  wide?: boolean;
  appearance?: "default" | "project";
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="dialog-backdrop fixed inset-0 z-50 bg-black/55 backdrop-blur-sm" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={`dialog-panel ${appearance === "project" ? "project-dialog" : ""} fixed left-1/2 top-1/2 z-50 w-[calc(100%_-_2rem)] ${wide ? "max-w-4xl" : "max-w-xl"} rounded-[28px] border border-border bg-card shadow-2xl`}
      >
        <div className="dialog-scroll max-h-[90dvh] overflow-y-auto overscroll-contain p-6 sm:p-9">
          {children}
        </div>
        <DialogPrimitive.Close
          aria-label="Close details"
          className="dialog-close absolute right-4 top-4 z-10 rounded-full bg-foreground p-2 text-background shadow-lg hover:opacity-80"
        >
          <X size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
