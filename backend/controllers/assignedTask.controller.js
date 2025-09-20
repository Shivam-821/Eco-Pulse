import { AssignTeam } from "../models/assignTeam.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const assignedTasks = asyncHandler(async (req, res) => {
  const team = req.team;

  try {
    const teamDetails = await AssignTeam.findById(team?._id).populate(
      "assignedWork"
    );
    if (!teamDetails) {
      return res.status(401).json(new ApiError(401, "UnAuthorized"));
    }

    const assignedTask = teamDetails.assignedWork.filter(
      (task) => task.completed === false
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { task: assignedTask, name: teamDetails?.teamname },
          "Data Fetched successfully"
        )
      );
  } catch (error) {
    console.error("ERROR :: assignedTask :: ", error);
    return res.status(500).json(new ApiError(500, "Something went wrong"));
  }
});

export { assignedTasks };
