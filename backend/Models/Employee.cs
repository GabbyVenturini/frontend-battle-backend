namespace FrontendBattle.Api.Models
{
    public class Employee
    {
        public int Id { get; set; }

        public string EmployeeName { get; set; } = string.Empty;

        public int DepartmentId { get; set; }

        public Department? Department { get; set; }

        public DateTime DateOfJoining { get; set; }

        public string PhotoFileName { get; set; } = string.Empty;
    }
}