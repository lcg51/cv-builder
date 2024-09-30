"use client";
import { Button } from "@/components/ui/button";
import { logIn } from "../server-actions/session";

export default function LoginButton() {
  return (
    <div>
      <Button onClick={() => logIn()}>Sign in</Button>
    </div>
  );
}
