using NUnit.Framework;
using System;
using System.ComponentModel.DataAnnotations;

namespace backend.tests;

public class ConfigurationBinderExtensionsTests
{
    internal class TestConfiguration
    {
        [Required(AllowEmptyStrings = false)]
        public string SomeProp { get; set; } = "";
    }

    internal class TestConfigurationNested
    {
        [Required(AllowEmptyStrings = false)]
        public string SomeOtherProp { get; set; } = "";

        [Required]
        public TestConfiguration TestConfiguration { get; set; } = new TestConfiguration();
    }


    [Test]
    public void TestConfigurationBinderValid()
    {
        var foo = new TestConfiguration { SomeProp = "foo" };

        Assert.DoesNotThrow(() => ConfigurationBinderExtension.ValidateOptions(foo));
    }

    [Test]
    public void TestConfigurationBinderInvalid()
    {
        var foo = new TestConfiguration { SomeProp = "" };

        Assert.Throws<ArgumentException>(() => ConfigurationBinderExtension.ValidateOptions(foo));
    }

    [Test]
    public void TestConfigurationBinderNestedInvalid()
    {
        var foo = new TestConfigurationNested { SomeOtherProp = "sup" };

        Assert.Throws<ArgumentException>(() => ConfigurationBinderExtension.ValidateOptions(foo));
    }
}
