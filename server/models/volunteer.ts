import * as mongoose from 'mongoose';

import Location from './location';
import Organization from './organization';
import Volunteer from './volunteer';
import { capitalizeWithNameCase } from '../functions/capitalize';

const volunteerSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId, ref: Organization,
    required: [true, 'Organization ID is required']
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId, ref: Location,
    required: [true, 'Location ID is required']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    minlength: [2],
    maxlength: [35],
    validate: /^[a-z ,.'-]+$/i,
    trim: true
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    minlength: [2],
    maxlength: [35],
    validate: /^[a-z ,.'-]+$/i,
    trim: true
  },
  petName: {
    type: String,
    required: [true, 'Favorite pet name is required'],
    minlength: [2],
    maxlength: [35],
    validate: /^[a-z ,.'-]+$/i,
    trim: true
  },
}, { timestamps: true });

volunteerSchema.index({ firstName: 1, lastName: 1, petName: 1 }, { unique: true });

// Before saving the user, capitalize name fields
volunteerSchema.pre('save', function(next) {
  this.firstName = this.capitalize(this.firstName);
  this.lastName = this.capitalize(this.lastName);
  this.petName = this.capitalize(this.petName);
  next();
});

volunteerSchema.methods.capitalize = capitalizeWithNameCase;

export default mongoose.model('Volunteer', volunteerSchema);
