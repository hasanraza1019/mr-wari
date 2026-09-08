import { useEffect, useState } from "react";

export default function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    fetch("https://mr-wari-backend-production.up.railway.app/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data.settings))
      .catch((err) => console.error("Settings load error:", err));
  }, []);

  return settings;
}
