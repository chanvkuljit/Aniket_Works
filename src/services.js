import http from "./http-common";

class Login {
  verifyOtpLogin(body) {
    return http.post("/auth/verify-otp", body);
  }

  requestOtpLogin(body) {
    return http.post("/auth/request-otp", body);
  }

  register(body) {
    return http.post("/auth/register", body);
  }

  getCurrentUserProfile() {
    return http.get("/users/me");
  }
}
const LoginService = new Login();

class Admin {
  createLiveClassSchedule(body){
    return http.post("/yoga-class", body)
  }
  fetchWeeklyClassSchedule(){
    return http.get("yoga-class/week/current")
  }
  getAllInstructors(){
    // Updated endpoint to match backend dropdown API
    return http.get("/users/trainers/dropdown")
  }
  fetchAllTheClasses(){
    return http.get("/yoga-class")
  }
  updateExistingClasses(trainerId,data){
    return http.put(`/yoga-class/${trainerId}`, data)
  }
  checkTimeSlotAvailability(params){
    const { day, time, instructorId } = params;
    // Manual URL construction to ensure %20 encoding for spaces
    const encodedTime = encodeURIComponent(time);
    const token = localStorage.getItem("token");
    
    return http.get(`/schedule/availability?day=${day}&time=${encodedTime}&instructorId=${instructorId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
  }
}

class User{
       fetchExerciseCategory(category){
        return http.get(`/yoga-class/category/${category.toUpperCase()}`);
       }
       bookClasses(classId){
        return http.post("/bookings",{classId})
       }
       allBookedClassesForLoggedInUsers(){
        return http.get("/bookings/upcoming")
       }
       notificationsService(){
        return http.get("/plans/notification")
       }
}
class Trainer{
        fetchDataByDate(date){
          return http.get(`/trainers/classes/date?date=${date}`);
        }
}
const UserService = new User();
const TrainerService = new Trainer();

const AdminService = new Admin();

export { LoginService , AdminService ,UserService,TrainerService };
