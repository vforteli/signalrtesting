using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace backend
{
    public static class ConfigurationBinderExtension
    {
        /// <summary>
        /// Bind and validate a configuration section
        /// </summary> 
        public static T GetAndValidate<T>(this IConfigurationSection configurationSection) => ValidateOptions<T>(configurationSection.Get<T>());

        /// <summary>
        /// Bind and validate configuration
        /// </summary>      
        public static T GetAndValidate<T>(this IConfiguration configuration) => ValidateOptions(configuration.Get<T>());

        /// <summary>
        /// Recursively validate an objects DataAnnotation attributes
        /// </summary>      
        public static T ValidateOptions<T>(T options)
        {
            ArgumentNullException.ThrowIfNull(options);

            var results = new List<ValidationResult>();
            if (!TryValidateOptions(options, results))
            {
                throw new ArgumentException($"Invalid configuration for {typeof(T)}: {string.Join(", ", results)}");
            }

            return options;
        }


        /// <summary>
        /// Recursively validate properties
        /// </summary>       
        private static bool TryValidateOptions<T>(T options, List<ValidationResult> results)
        {
            ArgumentNullException.ThrowIfNull(options);

            var isValid = Validator.TryValidateObject(options, new ValidationContext(options), results, true);

            foreach (var property in options.GetType().GetProperties().Where(p => p.PropertyType.GetProperties().Any()))
            {
                isValid = isValid && TryValidateOptions(property.GetValue(options), results);
            }

            return isValid;
        }
    }
}
