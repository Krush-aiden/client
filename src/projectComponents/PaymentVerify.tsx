import { useEffect, useState, useRef } from "react";
import { useSearchParams, NavLink } from "react-router-dom";
import axios from "axios";
import { Loader2, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_PAYMENT_URL: string | undefined =
  import.meta.env.VITE_ENVIRONMENT == "prod"
    ? `${import.meta.env.VITE_BACKEND_USER_API_URL_PROD}/api/v1/payment`
    : `${import.meta.env.VITE_BACKEND_USER_API_URL_DEV}/api/v1/payment`;

function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [status, setStatus] = useState<
    "loading" | "paid" | "failed" | "pending"
  >("loading");
  const [pollCount, setPollCount] = useState(0);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const MAX_POLLS = 10; // poll up to 10 times (~50s total)
  const POLL_INTERVAL = 5000; // 5 seconds between polls

  console.log("\n══════════════════════════════════════════════");
  console.log("🔍 PAYMENT VERIFY PAGE — Mounted");
  console.log("══════════════════════════════════════════════");
  console.log("📌 URL search params:", searchParams.toString());
  console.log("📌 orderId:", orderId);
  console.log("📌 API_PAYMENT_URL:", API_PAYMENT_URL);

  useEffect(() => {
    if (!orderId) {
      console.log("❌ No orderId in URL — setting status to failed");
      setStatus("failed");
      return;
    }

    let cancelled = false;

    const verify = async (attempt: number) => {
      try {
        const verifyUrl = `${API_PAYMENT_URL}/verify?orderId=${encodeURIComponent(orderId)}`;
        console.log(
          `\n📤 Calling verify API (attempt ${attempt + 1}/${MAX_POLLS}):`,
          verifyUrl,
        );

        const { data } = await axios.get(verifyUrl, { withCredentials: true });

        console.log("📥 Verify response:");
        console.log("   success:", data.success);
        console.log("   paymentStatus:", data.paymentStatus);
        console.log("   orderId:", data.orderId);

        if (cancelled) return;

        const finalStatus = data.paymentStatus || "failed";

        if (finalStatus === "pending" && attempt < MAX_POLLS - 1) {
          console.log(
            `⏳ Status is pending — will retry in ${POLL_INTERVAL / 1000}s (attempt ${attempt + 1}/${MAX_POLLS})`,
          );
          setStatus("pending");
          setPollCount(attempt + 1);
          pollTimerRef.current = setTimeout(() => {
            if (!cancelled) verify(attempt + 1);
          }, POLL_INTERVAL);
        } else {
          console.log("✅ Setting final page status to:", finalStatus);
          setStatus(finalStatus);
          setPollCount(attempt + 1);
        }
      } catch (err) {
        console.error("❌ Verify API call failed:", err);
        if (!cancelled) setStatus("failed");
      }
    };

    verify(0);

    return () => {
      cancelled = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, [orderId]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-orange" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Verifying payment...
        </p>
      </div>
    );
  }

  if (status === "paid") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-full p-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Payment Successful!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          Your order has been placed successfully. You can track your order
          status below.
        </p>
        <NavLink to="/order/status">
          <Button className="bg-orange hover:bg-HoverOrange text-white mt-2">
            View My Orders
          </Button>
        </NavLink>
      </div>
    );
  }

  if (status === "pending") {
    const isStillPolling = pollCount < MAX_POLLS;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-full p-6">
          {isStillPolling ? (
            <Loader2 className="h-16 w-16 text-yellow-500 animate-spin" />
          ) : (
            <Clock className="h-16 w-16 text-yellow-500" />
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Payment Pending
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
          {isStillPolling
            ? `Waiting for payment confirmation... (check ${pollCount}/${MAX_POLLS})`
            : "Your payment is still being processed. You can check your order status or try again later."}
        </p>
        <div className="flex gap-3 mt-2">
          {!isStillPolling && (
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Check Again
            </Button>
          )}
          <NavLink to="/order/status">
            <Button className="bg-orange hover:bg-HoverOrange text-white">
              View My Orders
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  // failed
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
      <div className="bg-red-50 dark:bg-red-900/20 rounded-full p-6">
        <XCircle className="h-16 w-16 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
        Payment Failed
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Something went wrong with your payment. Please try ordering again.
      </p>
      <NavLink to="/">
        <Button className="bg-orange hover:bg-HoverOrange text-white mt-2">
          Back to Home
        </Button>
      </NavLink>
    </div>
  );
}

export default PaymentVerify;
