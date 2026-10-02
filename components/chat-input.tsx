"use client";
import { useState, type FormEvent } from "react";
import { ArrowUp, Sparkles, Square } from "lucide-react";
import { motion } from "framer-motion";
export function ChatInput({
  onSend,
  busy = false,
  disabled = false,
  placeholder,
  onStop,
  home = false,
}: {
  onSend: (text: string) => void;
  busy?: boolean;
  disabled?: boolean;
  placeholder?: string;
  onStop?: () => void;
  home?: boolean;
}) {
  const [value, setValue] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || busy || disabled) return;
    onSend(text);
    setValue("");
  }
  return (
    <form className="chat-input" onSubmit={submit}>
      <Sparkles size={19} className="input-sparkle" aria-hidden="true" />
      <label
        className="sr-only"
        htmlFor={home ? "home-question" : "chat-question"}
      >
        Ask Kunal a question
      </label>
      <input
        id={home ? "home-question" : "chat-question"}
        name="question"
        autoComplete="off"
        maxLength={2000}
        disabled={disabled}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={
          placeholder ||
          (home ? "Ask me anything…" : "What else are you curious about?")
        }
      />
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        type={busy ? "button" : "submit"}
        disabled={disabled || (!busy && !value.trim())}
        onClick={busy ? onStop : undefined}
        className="send-button"
        aria-label={busy ? "Stop response" : "Send message"}
      >
        {busy ? (
          <Square size={15} fill="currentColor" />
        ) : (
          <ArrowUp size={21} />
        )}
      </motion.button>
    </form>
  );
}
