namespace JBS_API.Request_Model
{
    public class Error
    {
        public bool IsError { get; set; } = true;
        public string Message { get; set; } = "Ошибка сервера";
    }
}
