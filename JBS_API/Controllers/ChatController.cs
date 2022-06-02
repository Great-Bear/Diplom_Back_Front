using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using JBS_API.DB_Models;
using System.Threading.Tasks;
using JBS_API.Request_Model;
using System.Collections.Generic;
using JBS_API.Response_Model;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ChatController : Controller
    {
        DbContext _dbContext;

        public ChatController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("GetIdChat")]
        public JsonResult GetIdChat(int idBuyer, int idAd)
        {
            try
            {
                var chat = _dbContext.Chats.FirstOrDefault(c => c.UserId == idBuyer && c.AdId == idAd);

                int idChat = 0;

                if (chat != null)
                {
                    idChat = chat.Id;
                }

                return Json(
                  new
                  {
                      isError = false,
                      idChat = idChat
                  }
                 );

            }
            catch(Exception ex)
            {
                return Json(
                    new
                    {
                        isError = true,
                        Message = ex.Message,
                    }
                   );
            }     
        }

        [HttpPut]
        [Route("CreateChat")]
        public async Task<JsonResult> CreateChat(CreateChat newChat)
        {

            try
            {
                var existChat = _dbContext.Chats.FirstOrDefault(c => c.UserId == newChat.IdBuyer && c.AdId == newChat.IdAd);
                int idChat = 0;

                if (existChat != null)
                {
                    idChat = existChat.Id;
                }
                else
                {
                    await _dbContext.Chats.AddAsync(new Chat { AdId = newChat.IdAd, UserId = newChat.IdBuyer });
                    await _dbContext.SaveChangesAsync();

                    idChat = _dbContext.Chats.Skip( _dbContext.Chats.Count() - 1 ).First().Id;
                }

                return Json(new
                {
                    isError = false,
                    idChat = idChat
                }) ;
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isError = true,
                    Message = ex.Message
                });
            }
        }

        [HttpGet]
        [Route("MsgChat")]
        public JsonResult GetMsgChat(int idChat)
        {
            try
            {
                return Json( new
                {
                    isError = false,
                    data = _dbContext.Msg_Chats.Where(c => c.ChatId == idChat)
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isError = true,
                    message = ex.Message
                });
            }
          
        }

        [HttpGet]
        [Route("MyChats")]
        public JsonResult GetMyChats(int idUser)
        {
            try
            {
                var chats = _dbContext.Chats.Where(c => c.Msg_Chats.Count > 0 && (c.UserId == idUser || c.Ad.UserId == idUser)).ToArray();

                var myChatList = new List<Resp_My_Chat>();
                foreach (var itemChat in chats)
                {
                    var lastMsg = _dbContext.Msg_Chats.Where(m => m.ChatId == itemChat.Id).ToArray().Last();
                    myChatList.Add(new Resp_My_Chat
                    {
                        IdChat = itemChat.Id,
                        LastMsgChat = lastMsg.Value,
                        IdOwner = lastMsg.UserId,
                        IsRead = lastMsg.isRead
                    });
                }

                return Json( new { 
                    data = myChatList,
                    isError = false
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    message = ex.Message,
                    isError = false
                });
            }
           
        }



        [HttpGet]
        [Route("GetNewMsgChat")]
        public JsonResult GetMyChats(int idLastMsg, int idChat,int idUser)
        {
            var res = _dbContext.Msg_Chats.Where(m => m.ChatId == idChat && m.Id > idLastMsg && m.UserId != idUser);

            return Json( new
            {
                isError = false,
                data = res
            } );
        }

        [HttpGet]
        [Route("GetUnreadChatCount")]
        public JsonResult GetUnreadChatCount(int idUser)
        {

            try
            {
                    var myChats =
                 _dbContext.Chats.Where(
                     c => c.Msg_Chats.Count > 0
                     && (c.UserId == idUser || c.Ad.UserId == idUser)
                     && c.Msg_Chats.OrderBy(c => c.Id).Last().UserId != idUser
                     && c.Msg_Chats.OrderBy(c => c.Id).Last().isRead == false
                 );


                    return Json(new
                    {
                        countUnreadMsg = myChats.Count(),
                        isError = false
                    });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    message = ex.Message,
                    isError = true
                });
            }
          

            // var myChats =
            //       _dbContext.Chats.Where(c => c.Msg_Chats.Count > 0 && (c.UserId == idUser || c.Ad.UserId == idUser)).ToArray();

         /*   var res = myChats.GroupJoin(
                _dbContext.Msg_Chats.Where(c => c.isRead == false && c.UserId != idUser).ToArray(),
                chat => chat.Id,
                msg => msg.ChatId,
                (chat, msg) => new
                {
                    chat = chat,
                    msg = msg
                });


            int countUnredMsg = 0;
            foreach (var item in res)
            {
                if(item.msg.Count() > 0)
                {
                    countUnredMsg++;
                }
            }

            return Json(
            countUnredMsg
                ) ;*/
        }
         



    }
}
