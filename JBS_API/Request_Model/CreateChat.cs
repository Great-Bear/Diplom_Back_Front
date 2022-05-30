namespace JBS_API.Request_Model
{
    public class CreateChat
    {

       public int IdBuyer { get; set; }
       public int IdAd { get; set; }

        public CreateChat()
        {

        }
        public CreateChat(int idBuyer, int idAd)
        {
            IdBuyer = idBuyer;
            IdAd = idAd;
        }

    }
}
