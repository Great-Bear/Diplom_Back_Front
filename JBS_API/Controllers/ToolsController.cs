using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;

namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class ToolsController : Controller
    {
        DbContext _dbContext;
        public ToolsController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("categories")]
        public JsonResult Categories()
        {
            var arrayCat = _dbContext.Categories.ToArray();

            string[] namesCat = new string[arrayCat.Length];

            for (int i = 0; i < arrayCat.Length; i++)
            {
                namesCat[i] = arrayCat[i].Name;
            }

            return Json(
                namesCat
                );
        }

        [HttpGet]
        [Route("brends")]
        public JsonResult Brends()
        {
            var arrayBran = _dbContext.Brends.ToArray();

            string[] namesbran = new string[arrayBran.Length];

            for (int i = 0; i < arrayBran.Length; i++)
            {
                namesbran[i] = arrayBran[i].Name;
            }

            return Json(
                namesbran
                );
        }

    }
}
