import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ArrowRightLeft, RefreshCw, DollarSign, ArrowLeft } from "lucide-react";
import { getCurrencyFlagUrl } from "@/lib/flags";

interface ExchangeRates {
  base: string;
  date: string;
  rates: Record<string, number>;
  lastFetched: number;
  stale?: boolean;
}

const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "QAR", name: "Qatari Riyal", symbol: "﷼" },
];

interface CurrencyConverterProps {
  onBack?: () => void;
  showBackButton?: boolean;
  compact?: boolean;
}

export function CurrencyConverter({ onBack, showBackButton = true, compact = false }: CurrencyConverterProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("MXN");
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const { data: rates, isLoading, refetch, isFetching } = useQuery<ExchangeRates>({
    queryKey: ["/api/currency/rates"],
    staleTime: 4 * 60 * 60 * 1000,
    refetchInterval: 4 * 60 * 60 * 1000,
  });

  useEffect(() => {
    if (rates && amount) {
      const numAmount = parseFloat(amount);
      if (!isNaN(numAmount)) {
        const fromRate = rates.rates[fromCurrency] || 1;
        const toRate = rates.rates[toCurrency] || 1;
        const result = (numAmount / fromRate) * toRate;
        setConvertedAmount(result);
      }
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toFixed(4);
  };

  const getLastUpdated = () => {
    if (!rates) return "";
    const date = new Date(rates.lastFetched);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={compact ? "" : "pt-12 px-6 pb-8"}>
      {showBackButton && onBack && (
        <button onClick={onBack} className="flex items-center text-muted-foreground mb-6" data-testid="back-from-currency">
          <ArrowLeft className="w-5 h-5 mr-2 rtl-flip" />
          {t("common.back")}
        </button>
      )}

      <div className={`flex items-center gap-3 ${compact ? "mb-4" : "mb-6"}`}>
        <div className={`${compact ? "w-10 h-10" : "w-12 h-12"} rounded-full bg-gradient-to-br from-emerald-500 to-primary flex items-center justify-center`}>
          <DollarSign className={`${compact ? "w-5 h-5" : "w-6 h-6"} text-white`} />
        </div>
        <div>
          <h1 className={`${compact ? "text-xl" : "text-2xl"} font-display font-bold text-white`}>{t("planner.currency.title")}</h1>
          <p className="text-sm text-muted-foreground">{t("planner.currency.liveRates")}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
          {t("common.loading")}
        </div>
      ) : (
        <div className={`space-y-${compact ? "4" : "6"}`}>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("planner.currency.enterAmount")}</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={t("planner.currency.enterAmount")}
              className={`w-full bg-card border border-white/10 rounded-xl px-4 ${compact ? "py-3 text-xl" : "py-4 text-2xl"} font-bold text-white focus:outline-none focus:border-primary text-center`}
              data-testid="input-currency-amount"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("planner.currency.from")}</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className={`w-full bg-card border border-white/10 rounded-xl px-4 ${compact ? "py-3" : "py-4"} text-white font-medium focus:outline-none focus:border-primary appearance-none`}
              data-testid="select-from-currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-card">
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <button
              onClick={swapCurrencies}
              className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center hover:bg-primary/30 transition-colors active:scale-95"
              data-testid="button-swap-currencies"
              title={t("planner.currency.swapCurrencies")}
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">{t("planner.currency.to")}</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className={`w-full bg-card border border-white/10 rounded-xl px-4 ${compact ? "py-3" : "py-4"} text-white font-medium focus:outline-none focus:border-primary appearance-none`}
              data-testid="select-to-currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-card">
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {convertedAmount !== null && (
            <div className={`bg-gradient-to-r from-primary/20 to-emerald-600/20 border border-primary/30 rounded-2xl ${compact ? "p-4" : "p-6"} text-center`}>
              <div className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
                <img src={getCurrencyFlagUrl(fromCurrency)} alt={fromCurrency} className="w-5 h-4 object-cover rounded" />
                {amount} {fromCurrency} =
              </div>
              <div className={`${compact ? "text-2xl" : "text-3xl"} font-display font-bold text-white mb-1 flex items-center justify-center gap-2`}>
                <img src={getCurrencyFlagUrl(toCurrency)} alt={toCurrency} className="w-6 h-5 object-cover rounded" />
                {formatNumber(convertedAmount)} {toCurrency}
              </div>
              <div className="text-xs text-muted-foreground">
                1 {fromCurrency} = {formatNumber((rates?.rates[toCurrency] || 1) / (rates?.rates[fromCurrency] || 1))} {toCurrency}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-3">{t("planner.currency.quickConvertTo")} {toCurrency}</p>
            <div className="grid grid-cols-4 gap-2">
              {[10, 50, 100, 500].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(val.toString())}
                  className={`py-2 rounded-lg text-sm font-medium transition-colors ${
                    amount === val.toString()
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-white/10 text-white hover:bg-white/5"
                  }`}
                  data-testid={`quick-amount-${val}`}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-3">{t("planner.currency.hostCountryCurrencies")}</p>
            <div className="grid grid-cols-3 gap-2">
              {["USD", "CAD", "MXN"].map((code) => (
                <button
                  key={code}
                  onClick={() => setToCurrency(code)}
                  className={`py-3 rounded-xl text-center transition-colors flex flex-col items-center ${
                    toCurrency === code
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-white/10 text-white hover:bg-white/5"
                  }`}
                  data-testid={`host-currency-${code}`}
                >
                  <img src={getCurrencyFlagUrl(code)} alt={code} className="w-8 h-6 object-cover rounded mb-1" />
                  <div className="text-xs font-medium">{code}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground bg-card/50 rounded-xl p-3">
            <span>
              {rates?.stale ? t("planner.currency.ratesMayBeStale") : `${t("planner.currency.ratesUpdated")}: ${getLastUpdated()}`}
              {rates?.date && ` (${rates.date})`}
            </span>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-1 text-primary hover:text-primary/80"
              data-testid="button-refresh-rates"
            >
              <RefreshCw className={`w-3 h-3 ${isFetching ? "animate-spin" : ""}`} />
              {t("planner.currency.refreshRates")}
            </button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            {t("planner.currency.liveRates")}
          </p>
        </div>
      )}
    </div>
  );
}
