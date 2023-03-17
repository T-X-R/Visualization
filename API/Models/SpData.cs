using CsvHelper.Configuration;
using CsvHelper.Configuration.Attributes;

namespace API.Models
{
    public class SpData
    {
        [Name("Date")]
        public string Date { get; set; }

        [Name("Open")]
        public decimal Open { get; set; }

        [Name("High")]
        public decimal High { get; set; }

        [Name("Low")]
        public decimal Low { get; set; }

        [Name("Price")]
        public decimal Close { get; set; }

        [Name("Change %")]
        public string Change { get; set; }
    }
}