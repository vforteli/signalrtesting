using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public record SendMessageModel([Required(AllowEmptyStrings = false)] string Message);
}
