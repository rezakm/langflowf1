import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { CONTROL_PATCH_USER_STATE } from "@/constants/constants";
import { AuthContext } from "@/contexts/authContext";
import { usePostAddApiKey } from "@/controllers/API/queries/api-keys";
import useAlertStore from "@/stores/alertStore";
import { useStoreStore } from "@/stores/storeStore";
import { inputHandlerEventType } from "@/types/components";
import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import useScrollToElement from "../hooks/use-scroll-to-element";
import StoreApiKeyFormComponent from "./components/StoreApiKeyForm";

export const StoreApiKeyPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Store API Keys</h1>
        <p className="text-muted-foreground text-sm">
          Manage API keys for the Deeptern Store
        </p>
      </div>
      <ForwardedIconComponent name="Store" className="h-6 w-6" />
    </div>
  );
};

export default function StoreApiKeyPage() {
  const { scrollId } = useParams();
  const [inputState, setInputState] = useState(CONTROL_PATCH_USER_STATE);
  const { storeApiKey } = useContext(AuthContext);
  useScrollToElement(scrollId);

  const setSuccessData = useAlertStore((state) => state.setSuccessData);
  const setErrorData = useAlertStore((state) => state.setErrorData);
  const {
    validApiKey,
    hasApiKey,
    loadingApiKey,
    updateHasApiKey: setHasApiKey,
    updateValidApiKey: setValidApiKey,
    updateLoadingApiKey: setLoadingApiKey,
  } = useStoreStore();

  const { mutate: addApiKey } = usePostAddApiKey({
    onSuccess: () => {
      setSuccessData({ title: "API key saved successfully" });
      setHasApiKey(true);
      setValidApiKey(true);
      setLoadingApiKey(false);
      handleInput({ target: { name: "apikey", value: "" } });
    },
    onError: (error) => {
      setErrorData({
        title: "API key save error",
        list: [(error as any)?.response?.data?.detail],
      });
      setHasApiKey(false);
      setValidApiKey(false);
      setLoadingApiKey(false);
    },
  });

  const handleSaveKey = (apikey: string) => {
    if (apikey) {
      addApiKey({ key: apikey });
      storeApiKey(apikey);
    }
  };

  const handleInput = ({ target: { name, value } }: inputHandlerEventType) => {
    setInputState((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <StoreApiKeyPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>Store API Key Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreApiKeyFormComponent
            apikey={inputState.apikey}
            handleInput={handleInput}
            handleSaveKey={handleSaveKey}
            loadingApiKey={loadingApiKey}
            validApiKey={validApiKey}
            hasApiKey={hasApiKey}
          />
        </CardContent>
      </Card>
    </div>
  );
}
