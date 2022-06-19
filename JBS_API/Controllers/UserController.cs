using JBS_API.DB_Models;
using JBS_API.Request_Model;
using JBS_API.Response_Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MimeKit;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

using MimeKit;
using MailKit.Net.Smtp;
using System.Threading.Tasks;
using MailKit.Security;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class UserController : ControllerBase
    {

        DbContext _dbContext;
        ILogger<Startup> logger;
        public UserController(DbContext db, ILogger<Startup> logger)
        {
            _dbContext = db;
        }

        private async Task<JsonResult> SendEmail(string email, int idUser)
        {
            try
            {
                var emailMessage = new MimeMessage();

                emailMessage.From.Add(new MailboxAddress("Администрация сайта", "bgroholsky@gmail.com"));
                emailMessage.To.Add(new MailboxAddress("", email));
                emailMessage.Subject = "Регистрация на JBS";
                emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Html)
                {
                    Text = $"Ваша почта была указана при регистрации на сайте JBS для подтверждения перейдите на ссылке: <a>https://jbs.z22.web.core.windows.net/confirm_Email/{idUser}</a>"
                };
             
                using (var client = new SmtpClient())
                {
                     await  client.ConnectAsync("smtp.gmail.com", 465, SecureSocketOptions.SslOnConnect);
                     await client.AuthenticateAsync("bgroholsky", "cwhzkcawbnpnzssy");
                     await client.SendAsync(emailMessage);

                    await client.DisconnectAsync(true);
                }
            }
            catch(Exception ex)
            {
                return (new JsonResult(new { err = ex }));
            }
            return (new JsonResult(new { err = "ok" }));
        }

        [Route("confirmEmail")]
        [HttpPost]
        public async Task<JsonResult> confirmEmail(Requ_Confirm_Email requ_Confirm_Email)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.Id == requ_Confirm_Email.IdUser);

                if(user != null)
                {
                    user.IsConfirmEmail = true;
                    _dbContext.Users.Update(user);
                    await _dbContext.SaveChangesAsync();

                    return new JsonResult(new
                    {
                        isError = false,
                        data = user
                    }) ;
                }
                else
                {
                    return new JsonResult(new
                    {
                        isError = true,
                        Message = "Пользователь не зарегестрирован"
                    });
                }
            }
            catch (Exception)
            {
                return new JsonResult(new
                {
                    isError = true,
                    Message = "Ошибка сервера"
                });
                throw;
            }
        }

        [Route("register")]
        [HttpPost]
        public async Task<JsonResult> Register(Regu_register requ_Register)
        {
            try
            {
                if (_dbContext.Users.FirstOrDefault
                    (u => u.Email == requ_Register.Login) != null)
                {
                    return new JsonResult(new Resp_Register { Error = "Такой логин уже занят" });
                }


                User newUser = new User
                {
                    Email = requ_Register.Login,
                    Password = requ_Register.Password,
                    Role = _dbContext.Roles.First(p => p.Name == "User")
                };

                _dbContext.Users.Add(newUser);
                var wasAdded = _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                return new JsonResult(new Resp_Register { Error = "Ошибка сервера" });
            }


            var addedUser = _dbContext.Users.First(u => u.Email == requ_Register.Login);
            await SendEmail(addedUser.Email, addedUser.Id);

            return new JsonResult(new Resp_Register { Id = addedUser.Id, Role = addedUser.Role.Name });
        }


        [Route("login")]
        [HttpPost]
        public async Task<JsonResult> Login(Regu_Login regu_Login)
        {
            
            try
            {
                var existingUser = _dbContext.Users.FirstOrDefault(u => u.Email == regu_Login.Login
                                                       && u.Password == regu_Login.Password);

                if (existingUser == null)
                {
                    return new JsonResult(new Resp_Login { Error = "Пользователь не найден" });
                }

                if(existingUser.IsConfirmEmail == false)
                {
                    await SendEmail(existingUser.Email, existingUser.Id);
                    return new JsonResult(new Resp_Login { Error = "Почта не подтвержена, ссылка для подтверждения была отправлена на почту" });
                }

                _dbContext.Entry(existingUser).Reference("Role").Load();

               
                return new JsonResult(new Resp_Login { Id = existingUser.Id, Role = existingUser.Role.Name });
            }
            catch(Exception ex)
            {
                return new JsonResult(new Resp_Login { Error = "Ошибка сервера" });
            }
            

        }


        [Route("ResetPasswd")]
        [HttpPost]
        public JsonResult ResetPasswd(Requ_Reset_Passwd data)
        {
            try
            {
                var user = _dbContext.Users.FirstOrDefault(u => u.Email == data.Email);

                if(user == null)
                {
                    return new JsonResult(new
                    {
                        isError = true,
                        message = "Пользовател не найден"
                    });
                }

                user.Password = data.NewPasswd;
                _dbContext.Users.Update(user);
                _dbContext.SaveChangesAsync();

                return new JsonResult(new
                {
                    isError = false,
                });
            }
            catch (Exception ex)
            {
                return new JsonResult( new
                {
                    isError = true,
                    message = "Ошибка сервера",
                });
            }
           
        }


    }
}
