using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public record SendMessageModel(
        [Required] Guid ChatId,
        [Required(AllowEmptyStrings = false)] string Message
        );
}
