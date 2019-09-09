using ReactCodingChallenge.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace TestProject
{
    public class Crew
    {
        public List<Worker> Workers {get;set;}
        public float CrewCapacity
        {
            get {
                return Workers.Sum(x => x.Capacity);
            }
        }
        public Crew(params int[] workerTimeConsuming)
        {
            var amount = workerTimeConsuming.Length;
            if (amount > 0)
            {
                Workers = new List<Worker>(amount);
                foreach (var time in workerTimeConsuming)
                {
                    Workers.Add(new Worker() { TimeConsuming = time });
                }
            }
            else
                Workers = new List<Worker>();
        }
        /// <summary>
        /// We can Math.Ceiling the workLoad/CrewCapacity result, but in this case we wouldn't be able to check 
        /// the work using control sum since our calculation would take into account only the crew but not the individuals 
        /// </summary>
        /// <param name="workLoad">how many images we need to process</param>
        /// <param name="showCrewCapacity">if true we show calculation for every worker</param>
        /// <returns></returns>
        public CodingChallengeOutput CalculateProcess(int workLoad, bool showCrewCapacity=false)
        {
            
            if (CrewCapacity == 0)
            {
                throw new Exception("No crew - no work done");
            }
            ///calculate time when all workers work together
            int timeConsumeApproximetely = (int)Math.Floor(workLoad/CrewCapacity);
            ///calculate amount of images that every person finished during collective work
            foreach (var worker in Workers)
            {
                worker.WorkDoneForTheProces = worker.CalculateWorkForTime(timeConsumeApproximetely);
            }
            var controlSum = Workers.Sum(x => x.WorkDoneForTheProces);

            //if work is not done yet, we can forse a worker that finished first take 1 more image for processing
            while (controlSum < workLoad)
            {
                Worker firstFinished = Workers.Min(x => x);
                firstFinished.WorkDoneForTheProces++;
                //it could increase our total work time
                if (timeConsumeApproximetely < firstFinished.TimeConsumedDuringTheProces)
                {
                    timeConsumeApproximetely = firstFinished.TimeConsumedDuringTheProces;
                }
                //since we processed one more image we don't need to recalculate control sum, we can encrease it with 1
                controlSum ++;
            }

            if (showCrewCapacity)
            {
                ShowCrewCapacity();
            }
            return new CodingChallengeOutput { Minutes = timeConsumeApproximetely, CrewProductivity = Workers.Select(x=>x.WorkDoneForTheProces).ToArray() };
        }
        /// <summary>
        /// Show every worker progress and control sum to make sure that our caluclation is correct
        /// </summary>
        public void ShowCrewCapacity()
        {
            int counter = 0;
            foreach (var worker in Workers)
            {
                Console.WriteLine($"worker #{++counter}: worker speed: 1/{worker.TimeConsuming}; finished {worker.WorkDoneForTheProces} images; time consumed in total: {worker.TimeConsumedDuringTheProces}");
            }
            Console.WriteLine($"control sum is:{Workers.Sum(x => x.WorkDoneForTheProces)}");
        }
    }
}
