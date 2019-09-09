using System;

namespace TestProject
{
    public class Worker : IComparable
    {
        public int TimeConsuming { get; set; }
        public int WorkDoneForTheProces { get; set; }
        public int TimeConsumedDuringTheProces { get { return TimeConsuming* WorkDoneForTheProces; } }

        /// <summary>
        /// Capacity can't be negative
        /// </summary>
        public float Capacity
        {
            get
            {
                if (TimeConsuming < 1)
                    return 0;
                return 1f / TimeConsuming;
            }
        }
        /// <summary>
        /// Calculates how many images this worker can do during some period of time. 
        /// I use a method here, not the property and don't save the time because workers actual work and actual consumed time can very
        /// </summary>
        /// <param name="time"></param>
        /// <returns></returns>
        public int CalculateWorkForTime(int time)
        {
            return time / TimeConsuming;
        }
        /// <summary>
        /// implement compareTo interface that allows us to compare workers by their consumed time. 
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public int CompareTo(object obj)
        {
            Worker toCompare = obj as Worker;
            if (toCompare == null)
              return  1;
            //if (TimeConsumedDuringTheProces == toCompare.TimeConsumedDuringTheProces)
            //{
            //    return this.TimeConsuming.CompareTo(toCompare.TimeConsuming);

            //}
            return (this.TimeConsumedDuringTheProces + this.TimeConsuming).CompareTo(toCompare.TimeConsumedDuringTheProces + toCompare.TimeConsuming);
        }
    }
}
