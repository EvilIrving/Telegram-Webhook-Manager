"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { get } from "http";

// Set up webhook URL.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/setWebhook?url=https://whisper.cain-wuyi.workers.dev/

// delete webhook URL.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/deleteWebhook

// get webhook info.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/getWebhookInfo

// get updates.
// https://api.telegram.org/bot7545670078:AAG4TbRdtCabbUbER_4vVfTIbdkykzTHSfo/getUpdates

// get me
// https://api.telegram.org/bot<BOT_TOKEN>/getMe
const WebhookPage = () => {
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("Not Set Up");
  const setupWebhookUrl = async () => {
    // 清空 updates 
   if (updates) setUpdates(null);

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
      getWebhookInfo();
      toast({
        title: "Webhook Deleted",
        description: "Webhook has been deleted.",
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

  // const [me, setMe] = useState(null);
  const getMe = async () => {
    const path = `https://api.telegram.org/bot${token}/getMe`;
    const response = await fetch(path);
    const { ok, result } = await response.json();
    if (ok) {
      setWebhookInfo(result);
    }
  };

  const [updates, setUpdates] = useState(null);
  const getUpdates = async () => {
    // 先删除 webhook 再获取 updates
    await deleteWebhookUrl();
    setWebhookInfo(null);

    // 更新 updates 
    const path = `https://api.telegram.org/bot${token}/getUpdates`;
    const response = await fetch(path);
    const { ok, result } = await response.json();
    if (ok) {
      setUpdates(result);
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
          onChange={(e) => setToken(e.target.value.trim())}
          className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mb-4 text-sm text-gray-500">
          The bot tokens you enter are stored in your browser and used only in
          requests made directly to Telegram.
        </p>
      </div>

      <div className="mb-4">
        <Label htmlFor="url" className="block text-sm font-medium mb-1">
          URL:
        </Label>
        <Input
          type="text"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value.trim())}
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
        <button
          onClick={getMe}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Get Me
        </button>
        <button
          onClick={getUpdates}
          className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        >
          Get Updates
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

      {updates && (
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Updates</h2>
          <pre className="p-4 bg-gray-100 rounded">
            {JSON.stringify(updates, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
};

export default WebhookPage;
