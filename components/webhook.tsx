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

  const [token, setToken] = useState("");
  const [url, setUrl] = useState("");
  const setupWebhookUrl = async () => {
    console.log("setupWebhookUrl");

    const path = `https://api.telegram.org/bot${token}/setWebhook?url=${url}`;
    const response = await fetch(path);
    console.log(response, "response");

    const data = await response.json();
    console.log(data, "webhook set up");
  };
  const deleteWebhookUrl = async () => {
    const path = `https://api.telegram.org/bot${token}/deleteWebhook`;
    const response = await fetch(path);
    const data = await response.json();
    console.log(data, "webhook deleted");
  };
  const getWebhookInfo = async () => {
    const path = `https://api.telegram.org/bot${token}/getWebhookInfo`;
    const response = await fetch(path);
    const data = await response.json();
    console.log(data, "webhook info");
    toast({
      title: "Scheduled: Catch up",
      description: "Friday, February 10, 2023 at 5:57 PM",
    });
  };

  return (
    <section>

 
 

      <div className="flex gap-4 items-center">
        <div>
          <Label htmlFor="token">Bot Token</Label>
          <Input
            id="token"
            type="text"
            placeholder="Bot Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="url">Webhook URL</Label>
          <Input
            id="url"
            type="text"
            placeholder="Webhook url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button variant="secondary" onClick={() => setupWebhookUrl()}>
          Set up webhook
        </Button>
        <Button variant="secondary" onClick={() => deleteWebhookUrl()}>
          Delete webhook
        </Button>

        <Button variant="secondary" onClick={() => getWebhookInfo()}>
          Get webhook info
        </Button>
      </div>
    </section>
  );
};

export default WebhookPage;
