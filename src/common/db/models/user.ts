import bcrypt from "bcryptjs";
import mongoose, {
  type Document,
  type Model,
  type ObjectId,
  Schema,
} from "mongoose";
import type { TUser } from "@/api/user/userModel";
import { ErrorHandler } from "@/common/middleware/errorHandler";
import { Role } from "@/common/utils/constants/enums";

interface IUserSchema extends Document, Omit<TUser, "_id"> {
  _id: ObjectId;
}

const UserSchema = new Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    phone: {
      type: String,
      required: [true, "phone is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      enum: {
        values: [Role.ADMIN, Role.FARMER],
        message: `Please provide one of the following values:=> ${Role.ADMIN}, ${Role.FARMER}`,
      },
      required: [true, "role is required"],
    },
  },
  { timestamps: true }
);

// Hash the password before saving it
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    if (!salt) return next(new ErrorHandler("Failed to hash password"));

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      if (!hash) return next(new ErrorHandler("Failed to hash password"));

      this.password = hash;
      next();
    });
  });
});

const User: Model<IUserSchema> =
  mongoose.models.User || mongoose.model<IUserSchema>("User", UserSchema);

export default User;
