using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace backend
{
    public static class ConfigurationBinderExtension
    {
        public static T GetAndValidate<T>(this IConfigurationSection configurationSection) => ValidateOptions<T>(configurationSection.Get<T>());

        public static T GetAndValidate<T>(this IConfiguration configuration) => ValidateOptions(configuration.Get<T>());

        public static T ValidateOptions<T>(T options)
        {
            if (options == null)
            {
                throw new ArgumentNullException(typeof(T).ToString(), $"{typeof(T)} configuration section not found");
            }

            var results = new List<ValidationResult>();
            if (!Validator.TryValidateObject(options, new ValidationContext(options), results, true))
            {
                results.ForEach(o => Console.Error.WriteLine(o));
                throw new ArgumentException($"Invalid configuration for {typeof(T)}: {string.Join(", ", results)}");
            }

            return options;
        }
    }
}
