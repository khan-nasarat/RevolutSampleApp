using Newtonsoft.Json;

namespace RevolutSample.RequestResponse
{
    public class RefundOrderRequest
    {
        [JsonProperty("amount")]
        public long Amount { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("merchant_customer_ext_ref")]
        public string MerchantCustomerExtRef { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

    }
}
