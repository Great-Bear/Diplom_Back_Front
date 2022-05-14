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

            var arrFiltersValue = _dbContext.FilterValues.ToList();

            var filterValueCounts = arrFiltersValue.GroupJoin(
                   _dbContext.Filter_Ad.ToList(),
                   filterValue => filterValue.Id,
                   filtet_Ad => filtet_Ad.FilterValueId,
                       (filter, filtet_Ad) =>
                           new
                           {
                               idValueFilter = filter.Id,
                               Name = filter.Name,
                               count = filtet_Ad.Count()
                           }
                   );


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
                                id = valueFilter.Select(item => item.Id),
                                counts =
                                     valueFilter.Select(item => item.Id).ToList().GroupJoin(
                                             filterValueCounts.ToList(),
                                                filtetByCat => filtetByCat,
                                                filterValue => filterValue.idValueFilter,
                                                (filtetByCat, filterValue) =>                                   
                                                        filterValue.FirstOrDefault(f => f.idValueFilter == filtetByCat).count                                                   
                                            )                              
                            }
                    );

           

            return Json(respFilter);

        }
    }
}
