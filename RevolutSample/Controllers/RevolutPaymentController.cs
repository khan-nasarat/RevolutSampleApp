using Microsoft.AspNetCore.Mvc;
using RevolutSample.Helpers;
using RevolutSample.OutCalls;
using RevolutSample.RequestResponse;
using System;
using System.Threading.Tasks;

namespace RevolutSample.Controllers
{   
    [ApiController]
    public class RevolutPaymentController : ControllerBase
    {
        private readonly IRevolutApiClient _apiClient;

        public RevolutPaymentController(IRevolutApiClient revolutApiClient)
        {
            _apiClient = revolutApiClient ?? throw new ArgumentNullException(nameof(revolutApiClient));
        }

        [HttpPost("/revolut/create")]
        public async Task<Result<OrderResponse>> CreateOrder(CreateOrderRequest req)
        {
            string endpoint = "/orders";
            Result<OrderResponse> result = await _apiClient.Post<OrderResponse>(endpoint, req);
            return result;
        }

        [HttpGet("/revolut/retrieve")]
        public async Task<OrderResponse> RetriveOrder(string orderId)
        {
            string endpoint = $"/orders/{orderId}";
            OrderResponse result = await _apiClient.Get<OrderResponse>(endpoint);
            return result;
        }

        [HttpPost("/revolut/refund")]
        public async Task<Result<OrderResponse>> RefundOrder(string orderId, RefundOrderRequest refundOrderReq)
        {
            string endpoint = $"/orders/{orderId}/refund";
            Result<OrderResponse> result = await _apiClient.Post<OrderResponse>(endpoint, refundOrderReq);
            return result;

        }
    }
}
