module.exports = {
	GET: 'searchUser',
	PARAMETER: {
		GET: 'visitUserCard',
		verifiedAssets: {
			PARAMETER: {
				GET: "visitVerifiedUpload"
			}
		},
		myProblems: {
			GET: "visitSelfProblems",
			PARAMETER: {
				GET: "visitSelfProblemDetails"
			}
		},
    clear: {
		  POST: "clearUserInfo"
		},
		hide: {
			POST: "hideUserHome", // 隐藏用户的主页
		},
		banned: {
			PUT: 'unBannedUser',
			DELETE: 'bannedUser'
		},
		transaction: {
			GET: 'visitUserTransaction'
		},
    // 用户关注的 专业、用户、文章
    sub: {
		  t: {
		    GET: 'visitUserSubThreads'
      }
    },
		settings: {
			GET: 'visitUserInfoSettings',
			username: {
				PUT: 'modifyUsername'
			},
      info: {
        GET: 'visitUserInfoSettings',
        PUT: 'modifyUserInfo'
      },
      security: {
			  GET: "visitUserInfoSettings",
        PUT: "modifyUserInfo"
      },
      apps: {
        GET: 'visitUserInfoSettings',
        PUT: 'modifyUserInfo'
      },
			resume: {
				GET: 'visitUserResumeSettings',
				PUT: 'modifyUserResume'
			},
			transaction: {
				GET: 'visitUserTransactionSettings',
				PUT: 'modifyUserTransaction'
			},
			social: {
				GET: 'visitUserSocialSettings',
				PUT: 'modifyUserSocial'
			},
			photo: {
				GET: 'visitUserPhotoSettings',
				PUT: 'modifyUserPhotoSettings'
			},
			water: {
				GET: "visitUserWaterSettings",
				PUT: "modifyUserWaterSettings"
			},
			cert: {
				GET: 'visitUserCertPhotoSettings',
				PUT: 'modifyUserCertPhotoSettings'
			},
			password: {
				GET: 'visitPasswordSettings',
				PUT: 'modifyPassword'
			},
			mobile: {
				GET: 'visitMobileSettings',
				PUT: 'modifyMobile',
				DELETE: "unbindMobile",
				POST: 'bindMobile',
				apply: {
					GET: 'applyToChangeUnusedPhoneNumber',
					POST: 'applyToChangeUnusedPhoneNumber'
				},
				verify: {
					POST: 'applyToChangeUnusedPhoneNumber'
				}
			},
			email: {
				GET: 'visitEmailSettings',
				POST: 'sendEmail',
				bind: {
					GET: 'bindEmail'
				},
				verify: {
					GET: 'changeEmail'
				},
				unbind: {
					GET: 'unbindEmail'
				}
			},
			verify: {
				GET: "visitVerifySettings",
				verify3_form: {
					POST: "verify3VideoUpload"
				},
				verify2_form: {
					POST: "verify2ImageUpload"
				}
			},
      'red_envelope': {
			  GET: 'visitUserRedEnvelopeSettings',
        PUT: 'modifyUserRedEnvelopeSettings'
      },
      display: {
			  GET: 'userDisplaySettings',
        PUT: 'userDisplaySettings'
      },
      alipay: {
        POST: "userBindAlipayAccounts"
      },
      bank: {
        POST: 'userBindBankAccounts'
      }
		},
		drafts: {
			GET: 'visitDraftList',
			POST: 'addDraft',
			PARAMETER: {
				DELETE: 'deleteDraft'
			}
		},
		subscribe: {
			POST: 'subscribeUser',
			DELETE: 'unSubscribeUser',
			register: {
				GET: 'visitSubscribeForums',
				POST: 'submitSubscribeForums'
			}
		},
		bills: {
			GET: 'visitUserBills'
		},
    transfer: {
      GET: "transferKcbToUser",
      POST: "transferKcbToUser"
    },
		profile: {
			GET: 'userProfile',
			summary: {
				pie: {
					GET: "userProfile"
				},
				calendar: {
					GET: "userProfile"
				}
			},
			thread: {
				GET: "userProfile"
			},
			post: {
				GET: "userProfile"
			},
			draft: {
				GET: "userProfile"
			},
			finance: {
				GET: "userProfile"
			},
			follower: {
				GET: "userProfile"
			},
			subscribe: {
				user: {
					GET: "userProfile"
				},
				topic: {
					GET: "userProfile"
				},
				forum: {
					GET: 'userProfile',
				},
				discipline: {
					GET: "userProfile"
				},
				column: {
					GET: "userProfile"
				},
				thread: {
					GET: "userProfile"
				},
				collection: {
					GET: "userProfile"
				}
			},
			note: {
				GET: "userProfile"
			},
			blacklist: {
				GET: 'userProfile'
			}
		},
		destroy: {
    	GET: "destroyAccount",
			POST: "destroyAccount"
		},
		violationRecord: {
			GET: "violationRecord"
		},
		forum: {
			apply: {
				GET: 'applyForum',
				POST: 'applyForum'
			},
			invitation: {
				GET: 'applyForumInvitation',
				POST: 'applyForumInvitation'
			}
		},
		phoneVerify: {
			// GET: "phoneVerifyPage",
			POST: "phoneVerify",
			sendSmsCode: {
				POST: "sendPhoneVerifyCode"
			}
		},
		alt: {
			GET: 'getUserOtherAccount'
		},
    code: {
		  POST: 'viewUserCode'
    }
	}
};
