"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { motion } from "framer-motion";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export function DialogContent({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/35 backdrop-blur-sm" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={`fixed left-1/2 top-1/2 z-50 max-h-[90dvh] w-[calc(100%_-_2rem)] ${wide ? "max-w-4xl" : "max-w-xl"} -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-[28px] border border-border bg-card p-6 shadow-2xl sm:p-9`}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {children}
        </motion.div>
        <DialogPrimitive.Close
          aria-label="Close details"
          className="absolute right-4 top-4 rounded-full bg-muted p-2 hover:opacity-70"
        >
          <X size={18} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
