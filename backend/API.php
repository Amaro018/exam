
<?php
require_once('MysqliDb.php');

header("Access-Control-Allow-Origin: *");

/**
 * Tells browsers whether to expose the response to the frontend JavaScript code
 * when the request's credentials mode (Request.credentials) is include
 */
header("Access-Control-Allow-Credentials: true");

/**
 * Specifies one or more methods allowed when accessing a resource in response to a preflight request
 */
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE");

/**
 * Used in response to a preflight request which includes the Access-Control-Request-Headers to
 * indicate which HTTP headers can be used during the actual request
 */
header("Access-Control-Allow-Headers: Content-Type");

header("Content-Type: application/json");
class API {
    public function __construct()
    {
        $this->db = new MysqliDB('localhost', 'root', '', 'todolist');
    }


    public function httpGet($payload)
      {
    // Fetch tasks
    $tasks = $this->db->get('tasks');
    
    // Fetch task items for each task
    foreach ($tasks as &$task) {
        $this->db->where('task_id', $task['id']);
        $task['task_items'] = $this->db->get('task_items');
    }

    // Return the results as JSON
    echo json_encode($tasks);
          
      }

      public function httpPost($payload)
      {
        if (isset($payload['taskTitle']) && isset($payload['tasks'])) {
            $taskTitle = $payload['taskTitle'];
            $tasks = $payload['tasks'];
    
            // Insert the task title into the database
            $taskData = [
                'taskTitle' => $taskTitle
            ];
    
            $task_id = $this->db->insert('tasks', $taskData);
    
            // Insert each task (task name, time, and status)
            foreach ($tasks as $task) {
                $taskItem = [
                    'taskName' => $task['taskName'],
                    'taskTime' => $task['taskTime'],
                    'status' => $task['status'],
                    'task_id' => $task_id
                ];
    
                $this->db->insert('task_items', $taskItem);
            }
    
            echo json_encode(['message' => 'Task created successfully']);
        } else {
            echo json_encode(['error' => 'Invalid data']);
        }
      }


      public function httpPut($id,$payload) {
        $input = json_decode(file_get_contents('php://input'), true);
        $taskId = $input['task_id'] ?? null;
        $status = $input['status'] ?? null;
    
        if ($taskId && $status) {
            $this->db->where('id', $id)->update('task_items', $payload);
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid parameters']);
        }
    }
    
    
    

      public function httpDelete($id, $payload)
      {
           // Start Coding HERE
      }


  }
  $request_method = $_SERVER['REQUEST_METHOD'];
  if ($request_method === 'GET') {
    $received_data = $_GET;
} else {
    //check if method is PUT or DELETE, and get the ids on URL
    if ($request_method === 'PUT' || $request_method === 'DELETE') {
        $request_uri = $_SERVER['REQUEST_URI'];


        $ids = null;
        $exploded_request_uri = array_values(explode("/", $request_uri));
        $last_index = count($exploded_request_uri) - 1;


        $ids = $exploded_request_uri[$last_index];


        }
    }


    //payload data
    $received_data = json_decode(file_get_contents('php://input'), true);

    $api = new API;

 //Checking if what type of request and designating to specific functions
  switch ($request_method) {
      case 'GET':
          $api->httpGet($received_data);
          break;
      case 'POST':
          $api->httpPost($received_data);
          break;
      case 'PUT':
          $api->httpPut($ids, $received_data);
          break;
      case 'DELETE':
          $api->httpDelete($ids, $received_data);
          break;
  }


?>