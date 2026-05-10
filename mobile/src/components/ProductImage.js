import { useEffect, useMemo, useState } from "react";
import { Image } from "react-native";
import { getProductFallbackImageUrl, resolveProductImageUrl } from "../utils/productImages";

export default function ProductImage({ uri, resizeMode = "cover", ...props }) {
  const resolvedUri = useMemo(() => resolveProductImageUrl(uri), [uri]);
  const fallbackUri = getProductFallbackImageUrl();
  const [sourceUri, setSourceUri] = useState(resolvedUri);

  useEffect(() => {
    setSourceUri(resolvedUri);
  }, [resolvedUri]);

  return (
    <Image
      {...props}
      source={{ uri: sourceUri }}
      resizeMode={resizeMode}
      onError={() => {
        if (sourceUri !== fallbackUri) {
          setSourceUri(fallbackUri);
        }
      }}
    />
  );
}
