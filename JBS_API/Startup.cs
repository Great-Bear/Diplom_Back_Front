using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using MySql.Data.MySqlClient;
using System.Text.Json.Serialization;

namespace JBS_API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }


        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors();

            services.AddControllers();

            services.AddSwaggerGen();

          

            string con = "Server=localhost;Port=3306;Database=JBS;User=root;Password=1234;TreatTinyAsBoolean=true;CharSet=utf8";


            var builder = new MySqlConnectionStringBuilder
            {
                Server = "jbsserver.mysql.database.azure.com",
                Database = "jbs",
                UserID = "jbsadmin",
                Password = "123456789@Q",
                SslMode = MySqlSslMode.Required,
            };
          //  con = builder.ConnectionString;
          


            services.AddDbContext<DbContext>(options => options.UseMySQL(con));

            

           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "JBS_API v1"));
            }

            app.UseSwagger();

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseCors(corsPolicyBuilder => corsPolicyBuilder.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());


            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
