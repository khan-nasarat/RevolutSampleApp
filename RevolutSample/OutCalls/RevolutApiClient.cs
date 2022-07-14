using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using RevolutSample.Helpers;
using RevolutSample.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace RevolutSample.OutCalls
{
    public class RevolutApiClient : IRevolutApiClient
    {
       
        private HttpClient _httpClient;
        private string _endpoint;
        private JsonSerializerSettings _jsonSerializerSettings;


        public RevolutApiClient()
        {
            _endpoint = "https://sandbox-merchant.revolut.com/api/1.0";
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "sk_Ukm9YfHzEdbzehwSJS4Qqeqj5xs7YRS1TyVxrvQduuzeMNjPvaN1NC9OMe88hsER");
            _jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new SnakeCaseNamingStrategy()
                },
                DateFormatString = "yyyy-MM-dd"
            };
        }


        public async Task<T> Get<T>(string url)
        {
            string responseContent = "";
            try
            {
                var response = await _httpClient.GetAsync(_endpoint + url);
                if (response.Content != null)
                {
                    responseContent = await response.Content.ReadAsStringAsync();
                }
                if (response.IsSuccessStatusCode)
                {
                    return JsonConvert.DeserializeObject<T>(responseContent, _jsonSerializerSettings);
                }
                else
                {
                  
                }
            }
            catch (Exception ex)
            {
               
            }
            return default(T);
        }

        public async Task<Result<T>> Post<T>(string url, object obj)//create
        {
            string responseContent = "";
            try
            {
                string postData = JsonConvert.SerializeObject(obj, _jsonSerializerSettings);
                var response = await _httpClient.PostAsync(_endpoint + url, new StringContent(postData, Encoding.UTF8, "application/json"));
                if (response.Content != null)
                {
                    responseContent = await response.Content.ReadAsStringAsync();
                }
                if (response.IsSuccessStatusCode)
                {
                    return Result.Ok(JsonConvert.DeserializeObject<T>(responseContent, _jsonSerializerSettings));
                }
                else if (!string.IsNullOrEmpty(responseContent))
                {
                    return Result.Fail<T>(JsonConvert.DeserializeObject<ErrorModel>(responseContent, _jsonSerializerSettings).Message);
                }
                else
                {
                  
                }
            }
            catch (Exception ex)
            {
               
            }
            return Result.Fail<T>();
        }


        public async Task<Result<T>> PostFormData<T>(string url, List<KeyValuePair<string, string>> data)
        {
            string responseContent = "";
            try
            {
                _httpClient = new HttpClient();
                FormUrlEncodedContent formContent = new FormUrlEncodedContent(data.ToArray());
                var response = await _httpClient.PostAsync(_endpoint + url, formContent);

                if (response.Content != null)
                {
                    responseContent = await response.Content.ReadAsStringAsync();
                }
                if (response.IsSuccessStatusCode)
                {
                    return Result.Ok(JsonConvert.DeserializeObject<T>(responseContent, _jsonSerializerSettings));
                }
                else if (!string.IsNullOrEmpty(responseContent))
                {
                    return Result.Fail<T>(JsonConvert.DeserializeObject<ErrorModel>(responseContent, _jsonSerializerSettings).Message);
                }
                else
                {
                    
                }
            }
            catch (Exception ex)
            {
               
            }
            return Result.Fail<T>();
        }

        public async Task<T> Put<T>(string url, object obj)
        {
            string responseContent = "";
            try
            {
                string postData = JsonConvert.SerializeObject(obj);
                var response = await _httpClient.PutAsync(_endpoint + url, new StringContent(postData, Encoding.UTF8, "application/json"));
                if (response.Content != null)
                {
                    responseContent = await response.Content.ReadAsStringAsync();
                }
                if (response.IsSuccessStatusCode)
                {
                    return JsonConvert.DeserializeObject<T>(responseContent, _jsonSerializerSettings);
                }
                else
                {
                  
                }
            }
            catch (Exception ex)
            {
                
            }
            return default(T);
        }

        public async Task<T> Delete<T>(string url)
        {
            string responseContent = "";
            try
            {
                var response = await _httpClient.DeleteAsync(_endpoint + url);
                responseContent = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    return JsonConvert.DeserializeObject<T>(responseContent, _jsonSerializerSettings);
                }
                else
                {
                    
                }
            }
            catch (Exception ex)
            {

              
            }
            return default(T);
        }
        public async Task<bool> Delete(string url)
        {
            string responseContent = "";
            try
            {
                var response = await _httpClient.DeleteAsync(_endpoint + url);
                if (response.IsSuccessStatusCode)
                {
                    return true;
                }
                else
                {
                    responseContent = await response.Content.ReadAsStringAsync();
                 
                    return false;
                }
            }
            catch (Exception ex)
            {
            }
            return false;
        }
    }
}
