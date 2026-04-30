"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ContactForm from "./ContactForm";

export default function ContactPageClient() {
  const searchParams = useSearchParams();
  const prefillMessage = searchParams.get("message") || "";

  return <ContactForm prefillMessage={prefillMessage} />;
}
