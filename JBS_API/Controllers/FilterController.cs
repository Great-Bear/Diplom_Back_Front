using Microsoft.AspNetCore.Mvc;
using System.Linq;


namespace JBS_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [Produces("application/json")]
    public class FilterController : Controller
    {

        DbContext _dbContext;
        public FilterController(DbContext db)
        {
            _dbContext = db;
        }

        [HttpGet]
        [Route("GetFilters")]
        public JsonResult GetFilters(int idCat) 
        {

            var arrFilters = _dbContext.Filters.Where(f => f.CategoryId == idCat).ToList();
            
            foreach (var item in arrFilters)
            {
                _dbContext.Entry(item).Reference("TypeFilter").Load();
            }

               var respFilter =  arrFilters.GroupJoin(
                    _dbContext.FilterValues.ToList(),
                    filter => filter.Id,
                    valueFilter => valueFilter.FilterId,
                        (filter, valueFilter) =>
                            new
                            {
                                filterName = filter.FilterName,
                                typeName = filter.TypeFilter.Name,
                                value = valueFilter.Select(item => item.Name),
                                id = valueFilter.Select(item => item.Id)
                            }
                    );

            return Json(respFilter);

        }
    }
}
