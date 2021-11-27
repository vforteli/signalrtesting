using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace backend
{
    public class NullableSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            schema.Properties.Where(x => !x.Value.Nullable && !schema.Required.Contains(x.Key)).Select(x => x.Key).ToList().ForEach(o => schema.Required.Add(o));
        }
    }
}
