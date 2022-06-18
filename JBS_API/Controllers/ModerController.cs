using JBS_API.DB_Models;
using JBS_API.Request_Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ModerController : Controller
    {
        DbContext _dbContext;
        int idRoleModer;
        public ModerController(DbContext db)
        {
            _dbContext = db;
            idRoleModer = _dbContext.Roles.FirstOrDefault(r => r.Name == "Moder").Id;
        }

        [HttpGet]
        [Route("GetAllModers")]
        public JsonResult GetAllModers()
        {
            try
            {
                var res = _dbContext.Users.Where(u => u.RoleId == idRoleModer);
                return Json(new
                {
                    isError = false,
                    data = res
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isError = true,
                    message = "Ошибка сервера"
                });
            }
        }
        [HttpPost]
        [Route("AddModer")]
        public async Task<JsonResult> AddModer(NewModer newModer)
        {
            try
            {
                if (_dbContext.Users.FirstOrDefault(u => u.Email == newModer.Email) == null)
                {
                    await _dbContext.Users.AddAsync(new User
                    {
                        Email = newModer.Email,
                        RoleId = idRoleModer,
                        Password = newModer.Password,
                        IsConfirmEmail = true,
                    });
                    await _dbContext.SaveChangesAsync();

                    return Json(new
                    {
                        isError = false
                    });
                }
                else
                {
                    return Json(new
                    {
                        isError = true,
                        message = "Этот логин уже занят"
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    isError = true,
                    message = "Ошибка сервера"
                });
            }
        }
        [HttpDelete]
        [Route("DeleteModer")]
        public async Task<JsonResult> DeleteModer(int id)
        {
            try
            {
                var moder = _dbContext.Users.FirstOrDefaultAsync(u => u.Id == id).Result;
                if(moder == null)
                {
                    return Json(new Error { Message = "Пользователь не найден" });
                }
                if(moder.RoleId != idRoleModer)
                {
                    return Json(new Error { Message = "Пользователь не модератор" });
                }
                 _dbContext.Users.Remove(moder);
                await _dbContext.SaveChangesAsync();

                return Json( new Success() );

            }
            catch (Exception)
            {
                return Json( new Error() );
            }
        }
    }
}
