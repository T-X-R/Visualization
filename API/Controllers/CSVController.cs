using API.Models;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using CsvHelper;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CSVController : ControllerBase
    {
        [HttpGet]
        public ActionResult<IEnumerable<SpData>> GetSpData()
        {
            var data = new List<SpData>();
            string filePath = "../dataset.csv";
            if (!System.IO.File.Exists(filePath)) return NotFound();

            using (var streamReader = new StreamReader(filePath))
            {
                if(streamReader == null) return NotFound();
                using (var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture))
                {
                    data = csvReader.GetRecords<SpData>().ToList();

                }
            }

            return Ok(data);
        }

        [HttpPost("upload-csv")]
        public async Task<IActionResult> UploadCsv([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            if (!file.FileName.EndsWith(".csv"))
            {
                return BadRequest("Invalid file format");
            }

            using var streamReader = new StreamReader(file.OpenReadStream());

            using var csvReader = new CsvReader(streamReader, CultureInfo.InvariantCulture);
            
            var spDataList = new List<SpData>();

            await foreach (var record in csvReader.GetRecordsAsync<SpData>())
            {
                spDataList.Add(record);
            }
            
            return Ok(spDataList);
        }

    }
}