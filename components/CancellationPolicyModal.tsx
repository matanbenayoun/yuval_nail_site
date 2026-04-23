"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertCircle, Clock, MessageCircle, Ban } from "lucide-react"
import { whatsappHref } from "@/lib/config"

export default function CancellationPolicyModal() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            type="button"
            className="text-xs underline underline-offset-2 text-muted-foreground hover:text-foreground transition-colors"
            style={{ color: "oklch(0.61 0.072 62)" }}
          />
        }
      >
        מדיניות ביטולים
      </DialogTrigger>

      <DialogContent className="max-w-sm mx-auto rounded-3xl p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
              style={{ background: "oklch(0.89 0.022 65)" }}
            >
              <AlertCircle size={16} style={{ color: "oklch(0.61 0.072 62)" }} />
            </div>
            <DialogTitle className="text-base font-semibold">מדיניות ביטולים</DialogTitle>
          </div>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 text-sm">
          <PolicyItem
            icon={<Clock size={15} />}
            color="oklch(0.55 0.15 145)"
            title="ביטול חינם"
            text="ביטול תור עד 24 שעות לפני המועד — ללא עלות."
          />
          <PolicyItem
            icon={<AlertCircle size={15} />}
            color="oklch(0.65 0.14 65)"
            title="ביטול מאוחר"
            text="ביטול פחות מ-24 שעות לפני התור — חיוב של 50% ממחיר השירות."
          />
          <PolicyItem
            icon={<Ban size={15} />}
            color="oklch(0.577 0.245 27)"
            title="אי הגעה (No-Show)"
            text="אי הגעה ללא הודעה מראש — חיוב מלא של מחיר השירות."
          />
          <PolicyItem
            icon={<MessageCircle size={15} />}
            color="oklch(0.45 0.15 145)"
            title="איך מבטלים?"
            text={
              <span>
                שלחי הודעת ביטול{" "}
                <a
                  href={whatsappHref("ביטול תור")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2"
                  style={{ color: "oklch(0.45 0.15 145)" }}
                >
                  בוואטסאפ
                </a>{" "}
                עם שמך ותאריך התור.
              </span>
            }
          />
        </div>

        <div
          className="mx-6 mb-6 px-4 py-3 rounded-2xl text-xs text-muted-foreground leading-relaxed"
          style={{ background: "oklch(0.94 0.012 65)" }}
        >
          תשלום דמי ביטול הכרחי לקיום סדנת האמנות הקטנה שלנו ✨ תודה על ההבנה!
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PolicyItem({
  icon,
  color,
  title,
  text,
}: {
  icon: React.ReactNode
  color: string
  title: string
  text: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{ background: `color-mix(in oklch, ${color} 15%, transparent)`, color }}
      >
        {icon}
      </div>
      <div>
        <p className="font-semibold mb-0.5">{title}</p>
        <p className="text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
