"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WebhookConfig {
  id: string;
  name: string;
  token: string;
  url: string;
}

const WebhookPage = () => {
  const { toast } = useToast();

  const [configs, setConfigs] = useState<WebhookConfig[]>([]);
  // 初始状态 检测本地是否有缓存数据
  const [saveLocally, setSaveLocally] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<WebhookConfig | null>(
    null
  );
  const [newConfigName, setNewConfigName] = useState("");

  useEffect(() => {
    const storedConfigs = localStorage.getItem("webhookConfigs");
    if (storedConfigs) {
      const parsedConfigs = JSON.parse(storedConfigs);
      setConfigs(parsedConfigs);
      if (parsedConfigs.length > 0) {
        setSaveLocally(true);
        setCurrentConfig(parsedConfigs[0]);
      }
    }
  }, []);

  useEffect(() => {
    if (saveLocally) {
      localStorage.setItem("webhookConfigs", JSON.stringify(configs));
    } else {
      localStorage.removeItem("webhookConfigs");
    }
  }, [saveLocally, configs]);

  const saveConfigs = (newConfigs: WebhookConfig[]) => {
    setConfigs(newConfigs);
  };

  const addNewConfig = () => {
    if (newConfigName.trim() === "") {
      toast({
        title: "错误",
        description: "配置名称不能为空",
        variant: "destructive",
      });
      return;
    }

    // 检查是否存在重复的配置名称
    if (configs.some((config) => config.name === newConfigName.trim())) {
      toast({
        title: "错误",
        description: "配置名称已存在，请使用不同的名称",
        variant: "destructive",
      });
      return;
    }

    const newConfig: WebhookConfig = {
      id: Date.now().toString(),
      name: newConfigName.trim(),
      token: "",
      url: "",
    };
    const updatedConfigs = [...configs, newConfig];
    saveConfigs(updatedConfigs);
    setCurrentConfig(newConfig);
    setNewConfigName("");
    toast({
      title: "成功",
      description: "新配置已添加",
    });
  };

  const updateCurrentConfig = (field: "token" | "url", value: string) => {
    if (currentConfig) {
      const updatedConfig = { ...currentConfig, [field]: value };
      const updatedConfigs = configs.map((config) =>
        config.id === currentConfig.id ? updatedConfig : config
      );
      saveConfigs(updatedConfigs);
      setCurrentConfig(updatedConfig);
    }
  };

  const deleteCurrentConfig = () => {
    if (currentConfig) {
      const updatedConfigs = configs.filter(
        (config) => config.id !== currentConfig.id
      );
      saveConfigs(updatedConfigs);
      setCurrentConfig(updatedConfigs.length > 0 ? updatedConfigs[0] : null);
      toast({
        title: "成功",
        description: "当前配置已删除",
      });
    }
  };

  const [status, setStatus] = useState("Not Set Up");
  const setupWebhookUrl = async () => {
    if (currentConfig) {
      // 清空 updates
      if (updates) setUpdates(null);

      const path = `https://api.telegram.org/bot${currentConfig.token}/setWebhook?url=${currentConfig.url}`;
      const response = await fetch(path);

      const { ok, description } = await response.json();
      if (ok) {
        setStatus(description);
        toast({
          title: "Webhook Set Up",
          description: "Webhook has been set up successfully.",
        });
      }
    }
  };
  const deleteWebhookUrl = async () => {
    if (currentConfig) {
      const path = `https://api.telegram.org/bot${currentConfig.token}/deleteWebhook`;
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
    }
  };

  const [webhookInfo, setWebhookInfo] = useState(null);
  const getWebhookInfo = async () => {
    if (currentConfig) {
      const path = `https://api.telegram.org/bot${currentConfig.token}/getWebhookInfo`;
      const response = await fetch(path);
      const { ok, result } = await response.json();
      if (ok) {
        setWebhookInfo(result);
      }
    }
  };

  const getMe = async () => {
    if (currentConfig) {
      const path = `https://api.telegram.org/bot${currentConfig.token}/getMe`;
      const response = await fetch(path);
      const { ok, result } = await response.json();
      if (ok) {
        setWebhookInfo(result);
      }
    }
  };

  const [updates, setUpdates] = useState(null);
  const getUpdates = async () => {
    if (currentConfig) {
      // 先删除 webhook 再获取 updates
      await deleteWebhookUrl();
      setWebhookInfo(null);

      // 更新 updates
      const path = `https://api.telegram.org/bot${currentConfig.token}/getUpdates`;
      const response = await fetch(path);
      const { ok, result } = await response.json();
      if (ok) {
        setUpdates(result);
      }
    }
  };

  return (
    <section className="p-6 pt-0 max-w-screen-md mx-auto mb-20">
      <h1 className="text-2xl font-bold mb-4">Webhook 管理器</h1>

      <div className="mb-4">
        <Label
          htmlFor="newConfigName"
          className="block text-sm font-medium mb-1"
        >
          新配置名称：
        </Label>
        <div className="flex">
          <Input
            type="text"
            id="newConfigName"
            value={newConfigName}
            onChange={(e) => setNewConfigName(e.target.value)}
            className="flex-grow mr-2"
          />
          <Button onClick={addNewConfig}>添加新配置</Button>
        </div>
      </div>

      {configs.length > 0 && (
        <div className="mb-4">
          <Label
            htmlFor="configSelect"
            className="block text-sm font-medium mb-1"
          >
            选择配置：
          </Label>
          <Select
            value={currentConfig?.id}
            onValueChange={(value) =>
              setCurrentConfig(configs.find((c) => c.id === value) || null)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="选择一个配置" />
            </SelectTrigger>
            <SelectContent>
              {configs.map((config) => (
                <SelectItem key={config.id} value={config.id}>
                  {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="mb-4">
        <Label className="flex items-center">
          <input
            type="checkbox"
            checked={saveLocally}
            onChange={(e) => setSaveLocally(e.target.checked)}
            className="mr-2"
          />
          保存到本地
        </Label>
      </div>

      {currentConfig && (
        <>
          <div className="mb-4">
            <Label htmlFor="token" className="block text-sm font-medium mb-1">
              Token:
            </Label>
            <Input
              type="text"
              id="token"
              value={currentConfig.token}
              onChange={(e) =>
                updateCurrentConfig("token", e.target.value.trim())
              }
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="url" className="block text-sm font-medium mb-1">
              URL:
            </Label>
            <Input
              type="text"
              id="url"
              value={currentConfig.url}
              onChange={(e) =>
                updateCurrentConfig("url", e.target.value.trim())
              }
              className="w-full"
            />
          </div>

          <div className="flex justify-start gap-6 items-center mb-4">
            <Button onClick={setupWebhookUrl}>设置</Button>
            <Button onClick={deleteWebhookUrl} variant="destructive">
              删除
            </Button>
            <Button onClick={getWebhookInfo} variant="outline">
              获取信息
            </Button>
            <Button onClick={getMe} variant="outline">
              获取 Me
            </Button>
            <Button onClick={getUpdates} variant="outline">
              获取更新
            </Button>
            <Button onClick={deleteCurrentConfig} variant="destructive">
              删除当前配置
            </Button>
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
        </>
      )}
    </section>
  );
};

export default WebhookPage;
