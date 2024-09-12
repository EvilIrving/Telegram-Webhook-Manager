"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

// Set up webhook URL.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/setWebhook?url=https://whisper.cain-wuyi.workers.dev/

// delete webhook URL.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/deleteWebhook

// get webhook info.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/getWebhookInfo

// get updates.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/getUpdates

const WebhookPage = () => {
  const { toast } = useToast();

  const [token, setToken] = useState(" ");
  const [url, setUrl] = useState(" ");
  const [status, setStatus] = useState("Not Set Up");
  const setupWebhookUrl = async () => {
    const path = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;
    const response = await fetch(path);

    const { ok, description } = await response.json();
    if (ok) {
      setStatus(description);
      toast({
        title: "Webhook Set Up",
        description: "Webhook has been set up successfully.",
      });
    }
  };
  const deleteWebhookUrl = async () => {
    const path = `https://api.telegram.org/bot${token}/deleteWebhook`;
    const response = await fetch(path);

    const { ok, description } = await response.json();
    if (ok) {
      setStatus(description);
      toast({
        title: "Webhook Set Up",
        description: "Webhook has been set up successfully.",
      });
    }
  };

  const [webhookInfo, setWebhookInfo] = useState(null);
  const getWebhookInfo = async () => {
    const path = `https://api.telegram.org/bot${token}/getWebhookInfo`;
    const response = await fetch(path);
    const { ok, result } = await response.json();
    if (ok) {
      setWebhookInfo(result);
    }
  };

  return (
    <section className="p-6 max-w-screen-md mx-auto my-20">
      <h1 className="text-2xl font-bold mb-4">Webhook Manager</h1>
      <p className="mb-4">Manage your telegram bot webhook.</p>

      <div className="mb-4">
        <Label htmlFor="token" className="block text-sm font-medium mb-1">
          Token:
        </Label>
        <Input
          type="text"
          id="token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="url" className="block text-sm font-medium mb-1">
          URL:
        </Label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-start gap-6 items-center mb-4">
        <Button
          onClick={setupWebhookUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Set Up
        </Button>
        <Button
          onClick={deleteWebhookUrl}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Delete
        </Button>
        <button
          onClick={getWebhookInfo}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Get Info
        </button>
      </div>

      <div className="text-left">
        <p className="text-lg font-medium">
          Current Webhook Status:
          <span className="text-gray-500">{status}</span>
        </p>
      </div>

      {webhookInfo && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Webhook Information</h2>
          <pre className="p-4 bg-gray-100 rounded">
            {JSON.stringify(webhookInfo, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};

export default WebhookPage;
