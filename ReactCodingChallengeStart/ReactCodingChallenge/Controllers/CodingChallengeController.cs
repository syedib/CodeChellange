using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using TestProject;

namespace ReactCodingChallenge.Controllers
{
    [Route("api/[controller]")]
    public class CodingChallengeController : Controller
    {
        [HttpPost("[action]")]
        public CodingChallengeOutput CodingChallenge([FromBody]CodingChallengeInput input)
        {
            return CalculateProcess(input.ImageCount, input.CrewCapacity);
        }


        static CodingChallengeOutput CalculateProcess(int workLoad, int[] workers)
        {

            //string showProcess = Console.ReadLine();
            //bool showWorkersProcess = showProcess.ToUpper() == "Y";

            var checkedCrew = workers.Where(x => x > 0).ToArray();
            if (checkedCrew.Length < 1)
            {
                return null;
            }
            else if (checkedCrew.Length < workers.Length)
            {
                Console.WriteLine($"Your crew is not completely good, only {checkedCrew.Length} workers can do job");

            }

            Crew imageCrew = new Crew(checkedCrew);
            return imageCrew.CalculateProcess(workLoad);
        }
    }
    public class CodingChallengeInput
    {
        public int ImageCount { get; set; }
        public int[] CrewCapacity { get; set; }
    }

    public class CodingChallengeOutput
    {
        public int Minutes { get; set; }
        public int[] CrewProductivity { get; set; }
    }
}
