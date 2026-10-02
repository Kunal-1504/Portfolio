"use client";
import {
  BriefcaseBusiness,
  Layers2,
  Mail,
  Sparkles,
  UserRound,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { quickQuestions } from "@/data/portfolio";
const icons = {
  user: UserRound,
  briefcase: BriefcaseBusiness,
  layers: Layers2,
  sparkles: Sparkles,
  mail: Mail,
};
export function QuickQuestions({
  onSelect,
  onIntent,
  compact = false,
  disabled = false,
}: {
  onSelect: (question: string) => void;
  onIntent?: (question: string) => void;
  compact?: boolean;
  disabled?: boolean;
}) {
  return (
    <div
      className={compact ? "quick-questions compact" : "quick-questions"}
      aria-label="Explore my portfolio"
    >
      {quickQuestions.map((item) => {
        const Icon = icons[item.icon];
        return (
          <motion.button
            key={item.label}
            whileHover={{ y: compact ? -2 : -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(item.question)}
            onPointerEnter={() => onIntent?.(item.question)}
            onFocus={() => onIntent?.(item.question)}
            disabled={disabled}
            className={`question-card ${item.color}`}
            title={item.question}
          >
            <span className="question-icon">
              <Icon size={compact ? 15 : 20} strokeWidth={1.7} />
            </span>
            <span className="question-label">{item.label}</span>
            {!compact && <ArrowUpRight className="question-arrow" size={13} />}
          </motion.button>
        );
      })}
    </div>
  );
}
