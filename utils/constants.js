const constants = {
  httpStatusCode: {
    success: 200,
    unauthorised: 401,
    forbidden: 403,
    badRequest: 400,
    failedOperation: 500,
    duplicate: 409
  },
  responseCodes: {
    successfulOperation: 200,
    unauthorizedAccess: 401,
    failedOperation: 500,
    revalidation: 400,
    noContent: 204,
    forbidden: 403,
    notFound: 404,
    duplicate: 409
  },
  templateTypes: {},
  placeHoldersList: {},
  mailSubjects: {},
  messageKeys: {
    en: {
      msg_user_does_not_exist: 'User Does Not Exists',
      msg_supplier_does_not_exist: 'Supplier does not exists with this Email/Phone Number',
      msg_supplier_exist: 'Supplier is already registered with this Email/Phone Number',
      msg_invalid_mobile_no_or_email: 'Invalid User Mobile/Email',
      msg_invalid_user_name: 'Invalid Username',
      msg_success: 'Successful Operation',
      msg_failed: 'Something went wrong',
      msg_revalidate: 'Schema Validation Failed',
      msg_no_data: 'No Data Found',
      msg_existing_password_incorrect: 'Your existing Password is incorrect.',
      msg_invalid_name_or_email: 'Invalid User Name/Email Or Password',
      msg_already_exist: 'Data Already Exists In Records',
      msg_company_details_exist: 'Company Name Already Exists',
      msg_wrong_password: 'Incorrect Password',
      msg_invalid_otp: 'Invalid Otp',
      msg_invalid_password: 'Passwords Not Match',
      msg_otp_not_generated: 'Otp Not Genereted',
      msg_reset_password_sucess: 'Password Reset Completed',
      msg_reset_password_failed: 'Password Reset Failed',
      msg_no_login_credentials_sent: 'No Credentials Sent! Unauthorized Access',
      msg_unauthorized_user: 'Unauthorized Access',
      msg_changed_password_successfully: 'Changed Password SuccessFully',
      msg_same_password: 'Your old Password and New Password are same.',
      msg_upload_images: 'Please Upload Images',
      msg_customer_does_not_exist: 'Customer Does Not Exists'
    }
  },

  errorMessage: {
    en: {
      msg_email_exists: 'Email Alredy Exists',
      msg_email_verification: 'Email Is Alredy Verified.',
      msg_invalid_token: 'Invalid token',
      msg_email_not_registered: 'This Email Address Is Not Registered',
      msg_email_not_verified: 'Please Verify Email Address By Clicking Verification Link Received On Your Email Address',
      msg_password_incorrect: 'Incorrect password',
      msg_acoount_not_exists: 'Account Does Not Exist',
      msg_email_link_failed: 'Error While Sending Email',
      msg_user_not_found: 'User Not Found',
      msg_link_invalid: 'Invalid Link Or Expired',
      msg_password_wrong: 'Wrong Old Password',
      msg_session_update_error: 'Error While Updating The Session Logout Details',
      msg_profile_save: 'Error While Updating The User Details',
      msg_save_address_error: 'Error While Saving The Address Details',
      msg_delete_address_error: 'Error While Deleting The Address',
      msg_no_content_exist: 'Content Page Does Not Exist',
      msg_no_faq_exist: 'Faq Does Not Exist',
      msg_video_max: 'Maximum 10 Active Videos Are Allowed!',
      msg_video_size: 'Maximum 50MB Size Videos Are Allowed!',
      msg_pdf_size: 'Maximum 10MB Size File Are Allowed!',
      msg_invalid_file: 'Invalid File',
      msg_sequence_error: 'Sequence Already Added',
      msg_file_not_exist: 'File Does Not Exist',
      msg_file_link_failed: 'Error While Sending File',
      msg_video_not_exist: 'Video Does Not Exists',
      msg_max_file_error: 'Max 2 File You Can Upload'
    }
  },
  successMessage: {
    en: {
      msg_email_verified: 'Your email Is Verified Successfully!.Please Login To Continue.',
      msg_password_link_sent: 'Password Reset Link Sent To Your Email Account',
      msg_password_reset_success: 'Password Reset Successfully',
      msg_password_change: 'Password Changed Successfully',
      msg_logout: 'Logout Successfully',
      msg_profile_updated: 'Changes Saved Successfully',
      msg_save_address: 'Address Saved Successfully',
      msg_delete_address: 'Address Deleted Successfully',
      msg_email_verification_link: 'Email Verification Link Sent Successfully To Your Email Address',
      msg_video_delete: 'Video Deleted Successfully',
      msg_file_delete: 'File Deleted Successfully',
      msg_pdf_link_sent: 'File Link Shared Successfully',
      msg_file_deleted: 'File Deleted Successfully'
    }
  },
  moduleNames: {
    models: 'models',
    configurations: 'configurations',
    user: 'user'
  },
  uniqueColumn: {},
  publicAPIForAdmin: [
    '/admin/register',
    '/admin/login',
    '/admin/forgot-password',
    '/admin/reset-password',
    '/admin/loggedIn/userList',
    '/admin/loggedIn/userCount',
    '/admin/logIn/user'
  ],
  publicAPIForCustomers: [
    '/register',
    '/login',
    '/verify-email',
    '/send-verification-mail',
    '/forgot-password',
    '/reset-password',
    '/encrypt',
    '/home/contact/add',
    '/home/cms/getById',
    '/home/faq/get',
    '/home/contact',
    '/home/video/get',
    '/home/video/count'
  ],
  limit: 15,
  platforms: {
    user: 'user',
    admin: 'admin',
    customers: 'customers',
    suppliers: 'suppliers'
  },
  userRole: {
    admin: 'admin',
    user: 'user'
  },
  sessionType: {
    login: 'login',
    emailVerification: 'emailVerification',
    forgotPassword: 'forgotPassword'
  },
  cmsName: {
    privacyPolicy: 'Privacy Policy'
  },
  mediaType: {
    video: 'video',
    image: 'image',
    pdf: 'pdf'
  },
  documentType: {
    will: 'will',
    funeral: 'funeral',
    health: 'health'
  },
  errors: {
    group: {
      creatingGroup: 'Error while Creating Group.',
      alreadyExist: 'Already Same Group Created Please Check.'
    },
    category: {
      creatingCategory: 'Error while Creating Category.',
      existingCategory: 'Already Same Category Created Please Check.'
    },
    classes: {
      creatingClasses: 'Error while Creating Classes.',
      existingClasses: 'Already Same Classes Created Please Check.'
    },
    subclasses: {
      creatingSubClasses: 'Error while Creating Sub Classes.',
      existingSubClasses: 'Already Same Sub Classes Created Please Check.'
    }
  },
  moduleConstants: {
    purposeType2FA: '2FA',
    purposeTypeForgotPassword: 'FORGOT_PASSWORD',
    purposeTypeRegister: 'REGISTRATION'
  }
}

module.exports = constants
