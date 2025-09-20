import { Admin } from "../models/admin.model.js";
import { SmartBin } from "../models/SmartBin.model.js";
import { Regdump } from "../models/registerDump.model.js";
import { Recycle } from "../models/recycle.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const dumpStats = asyncHandler(async (req, res) => {
  try {
    // all stats related to dump, smart-bin, Recycle
    const [
      complainLodge,
      completedTask,
      totalTask,
      totalSmartBin,
      totalRecycled,
      pendingRecycle,
    ] = await Promise.all([
      Regdump.countDocuments({ complainLodge: true }),
      Regdump.countDocuments({ completed: true }),
      Regdump.countDocuments(),
      SmartBin.countDocuments(),
      Recycle.countDocuments({ status: "collected" }),
      Recycle.countDocuments({ status: "Pending" }),
    ]);

    const notCompletedTask = totalTask - completedTask;

    // Percentages
    const dumpCompletionRate =
      totalTask > 0 ? ((completedTask / totalTask) * 100).toFixed(1) : 0;

    const recycleSuccessRate =
      totalRecycled + pendingRecycle > 0
        ? ((totalRecycled / (totalRecycled + pendingRecycle)) * 100).toFixed(1)
        : 0;

    // top 5 users who reported the dump most
    const topUsers = await User.aggregate([
      {
        $project: {
          fullname: 1,
          email: 1,
          avatar: 1,
          dumpCount: { $size: { $ifNull: ["$dumpRegistered", []] } },
        },
      },
      { $sort: { dumpCount: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json(
      new ApiResponse(200, {
        dumps: {
          total: totalTask,
          completed: completedTask,
          pending: notCompletedTask,
          complainLodge,
          completionRate: Number(dumpCompletionRate),
        },
        smartBins: {
          total: totalSmartBin,
        },
        recycle: {
          collected: totalRecycled,
          pending: pendingRecycle,
          successRate: Number(recycleSuccessRate),
        },
        topUsers, // top 5 users
      })
    );
  } catch (error) {
    console.error("Error fetching statistic data:", error);
    return res.status(500).json(new ApiError(500, "Internal server error"));
  }
});

export { dumpStats };
