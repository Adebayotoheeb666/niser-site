import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_ha.dart';
import 'app_localizations_ig.dart';
import 'app_localizations_yo.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'generated/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('ha'),
    Locale('ig'),
    Locale('yo')
  ];

  /// No description provided for @appTitle.
  ///
  /// In en, this message translates to:
  /// **'NISER'**
  String get appTitle;

  /// No description provided for @tabHome.
  ///
  /// In en, this message translates to:
  /// **'Home'**
  String get tabHome;

  /// No description provided for @tabResearch.
  ///
  /// In en, this message translates to:
  /// **'Research'**
  String get tabResearch;

  /// No description provided for @tabPeople.
  ///
  /// In en, this message translates to:
  /// **'People'**
  String get tabPeople;

  /// No description provided for @tabChat.
  ///
  /// In en, this message translates to:
  /// **'Ask NISER'**
  String get tabChat;

  /// No description provided for @tabMore.
  ///
  /// In en, this message translates to:
  /// **'More'**
  String get tabMore;

  /// No description provided for @search.
  ///
  /// In en, this message translates to:
  /// **'Search'**
  String get search;

  /// No description provided for @cancel.
  ///
  /// In en, this message translates to:
  /// **'Cancel'**
  String get cancel;

  /// No description provided for @retry.
  ///
  /// In en, this message translates to:
  /// **'Retry'**
  String get retry;

  /// No description provided for @loading.
  ///
  /// In en, this message translates to:
  /// **'Loading…'**
  String get loading;

  /// No description provided for @offline.
  ///
  /// In en, this message translates to:
  /// **'You are offline — showing saved content'**
  String get offline;

  /// No description provided for @clearCache.
  ///
  /// In en, this message translates to:
  /// **'Clear cache'**
  String get clearCache;

  /// No description provided for @settings.
  ///
  /// In en, this message translates to:
  /// **'Settings'**
  String get settings;

  /// No description provided for @about.
  ///
  /// In en, this message translates to:
  /// **'About'**
  String get about;

  /// No description provided for @notifications.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get notifications;

  /// No description provided for @privacyPolicy.
  ///
  /// In en, this message translates to:
  /// **'Privacy policy'**
  String get privacyPolicy;

  /// No description provided for @refresh.
  ///
  /// In en, this message translates to:
  /// **'Refresh'**
  String get refresh;

  /// No description provided for @viewAll.
  ///
  /// In en, this message translates to:
  /// **'View all'**
  String get viewAll;

  /// No description provided for @emptyState.
  ///
  /// In en, this message translates to:
  /// **'Nothing here yet.'**
  String get emptyState;

  /// No description provided for @errorGeneric.
  ///
  /// In en, this message translates to:
  /// **'Something went wrong. Please try again.'**
  String get errorGeneric;

  /// No description provided for @copy.
  ///
  /// In en, this message translates to:
  /// **'Copy'**
  String get copy;

  /// No description provided for @copied.
  ///
  /// In en, this message translates to:
  /// **'Copied to clipboard'**
  String get copied;

  /// No description provided for @open.
  ///
  /// In en, this message translates to:
  /// **'Open'**
  String get open;

  /// No description provided for @published.
  ///
  /// In en, this message translates to:
  /// **'Published'**
  String get published;

  /// No description provided for @noResults.
  ///
  /// In en, this message translates to:
  /// **'No results found.'**
  String get noResults;

  /// No description provided for @allYears.
  ///
  /// In en, this message translates to:
  /// **'All years'**
  String get allYears;

  /// No description provided for @homeHeroTitle.
  ///
  /// In en, this message translates to:
  /// **'Welcome to NISER'**
  String get homeHeroTitle;

  /// No description provided for @homeHeroSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Nigerian Institute of Social and Economic Research'**
  String get homeHeroSubtitle;

  /// No description provided for @latestNews.
  ///
  /// In en, this message translates to:
  /// **'Latest news'**
  String get latestNews;

  /// No description provided for @upcomingEvents.
  ///
  /// In en, this message translates to:
  /// **'Upcoming events'**
  String get upcomingEvents;

  /// No description provided for @featuredInsights.
  ///
  /// In en, this message translates to:
  /// **'Featured insights'**
  String get featuredInsights;

  /// No description provided for @quickLinks.
  ///
  /// In en, this message translates to:
  /// **'Quick links'**
  String get quickLinks;

  /// No description provided for @viewAllNews.
  ///
  /// In en, this message translates to:
  /// **'View all news'**
  String get viewAllNews;

  /// No description provided for @viewAllEvents.
  ///
  /// In en, this message translates to:
  /// **'View all events'**
  String get viewAllEvents;

  /// No description provided for @viewAllInsights.
  ///
  /// In en, this message translates to:
  /// **'View all insights'**
  String get viewAllInsights;

  /// No description provided for @publications.
  ///
  /// In en, this message translates to:
  /// **'Publications'**
  String get publications;

  /// No description provided for @noPublications.
  ///
  /// In en, this message translates to:
  /// **'No publications found.'**
  String get noPublications;

  /// No description provided for @filter.
  ///
  /// In en, this message translates to:
  /// **'Filter'**
  String get filter;

  /// No description provided for @searchPublications.
  ///
  /// In en, this message translates to:
  /// **'Search publications…'**
  String get searchPublications;

  /// No description provided for @allTypes.
  ///
  /// In en, this message translates to:
  /// **'All types'**
  String get allTypes;

  /// No description provided for @allDivisions.
  ///
  /// In en, this message translates to:
  /// **'All divisions'**
  String get allDivisions;

  /// No description provided for @openAccess.
  ///
  /// In en, this message translates to:
  /// **'Open access'**
  String get openAccess;

  /// No description provided for @citation.
  ///
  /// In en, this message translates to:
  /// **'Citation'**
  String get citation;

  /// No description provided for @downloadPdf.
  ///
  /// In en, this message translates to:
  /// **'Download PDF'**
  String get downloadPdf;

  /// No description provided for @relatedPublications.
  ///
  /// In en, this message translates to:
  /// **'Related publications'**
  String get relatedPublications;

  /// No description provided for @workingPaper.
  ///
  /// In en, this message translates to:
  /// **'Working paper'**
  String get workingPaper;

  /// No description provided for @policyBrief.
  ///
  /// In en, this message translates to:
  /// **'Policy brief'**
  String get policyBrief;

  /// No description provided for @journalArticle.
  ///
  /// In en, this message translates to:
  /// **'Journal article'**
  String get journalArticle;

  /// No description provided for @bookChapter.
  ///
  /// In en, this message translates to:
  /// **'Book chapter'**
  String get bookChapter;

  /// No description provided for @annualReport.
  ///
  /// In en, this message translates to:
  /// **'Annual report'**
  String get annualReport;

  /// No description provided for @conferencePaper.
  ///
  /// In en, this message translates to:
  /// **'Conference paper'**
  String get conferencePaper;

  /// No description provided for @macroeconomics.
  ///
  /// In en, this message translates to:
  /// **'Macroeconomics'**
  String get macroeconomics;

  /// No description provided for @povertySocial.
  ///
  /// In en, this message translates to:
  /// **'Poverty & Social'**
  String get povertySocial;

  /// No description provided for @agriculture.
  ///
  /// In en, this message translates to:
  /// **'Agriculture'**
  String get agriculture;

  /// No description provided for @governance.
  ///
  /// In en, this message translates to:
  /// **'Governance'**
  String get governance;

  /// No description provided for @industry.
  ///
  /// In en, this message translates to:
  /// **'Industry'**
  String get industry;

  /// No description provided for @researchers.
  ///
  /// In en, this message translates to:
  /// **'Researchers'**
  String get researchers;

  /// No description provided for @noResearchers.
  ///
  /// In en, this message translates to:
  /// **'No researchers found.'**
  String get noResearchers;

  /// No description provided for @searchResearchers.
  ///
  /// In en, this message translates to:
  /// **'Search researchers…'**
  String get searchResearchers;

  /// No description provided for @biography.
  ///
  /// In en, this message translates to:
  /// **'Biography'**
  String get biography;

  /// No description provided for @researchInterests.
  ///
  /// In en, this message translates to:
  /// **'Research interests'**
  String get researchInterests;

  /// No description provided for @selectedPublications.
  ///
  /// In en, this message translates to:
  /// **'Selected publications'**
  String get selectedPublications;

  /// No description provided for @contact.
  ///
  /// In en, this message translates to:
  /// **'Contact'**
  String get contact;

  /// No description provided for @orcid.
  ///
  /// In en, this message translates to:
  /// **'ORCID'**
  String get orcid;

  /// No description provided for @phone.
  ///
  /// In en, this message translates to:
  /// **'Phone'**
  String get phone;

  /// No description provided for @email.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get email;

  /// No description provided for @website.
  ///
  /// In en, this message translates to:
  /// **'Website'**
  String get website;

  /// No description provided for @insights.
  ///
  /// In en, this message translates to:
  /// **'Insights'**
  String get insights;

  /// No description provided for @noInsights.
  ///
  /// In en, this message translates to:
  /// **'No insights found.'**
  String get noInsights;

  /// No description provided for @searchInsights.
  ///
  /// In en, this message translates to:
  /// **'Search insights…'**
  String get searchInsights;

  /// No description provided for @allContentTypes.
  ///
  /// In en, this message translates to:
  /// **'All formats'**
  String get allContentTypes;

  /// No description provided for @commentary.
  ///
  /// In en, this message translates to:
  /// **'Commentary'**
  String get commentary;

  /// No description provided for @analysis.
  ///
  /// In en, this message translates to:
  /// **'Analysis'**
  String get analysis;

  /// No description provided for @opinion.
  ///
  /// In en, this message translates to:
  /// **'Opinion'**
  String get opinion;

  /// No description provided for @rapidResponse.
  ///
  /// In en, this message translates to:
  /// **'Rapid response'**
  String get rapidResponse;

  /// No description provided for @events.
  ///
  /// In en, this message translates to:
  /// **'Events'**
  String get events;

  /// No description provided for @noEvents.
  ///
  /// In en, this message translates to:
  /// **'No events found.'**
  String get noEvents;

  /// No description provided for @upcoming.
  ///
  /// In en, this message translates to:
  /// **'Upcoming'**
  String get upcoming;

  /// No description provided for @past.
  ///
  /// In en, this message translates to:
  /// **'Past'**
  String get past;

  /// No description provided for @register.
  ///
  /// In en, this message translates to:
  /// **'Register'**
  String get register;

  /// No description provided for @addToCalendar.
  ///
  /// In en, this message translates to:
  /// **'Add to calendar'**
  String get addToCalendar;

  /// No description provided for @location.
  ///
  /// In en, this message translates to:
  /// **'Location'**
  String get location;

  /// No description provided for @onlineEvent.
  ///
  /// In en, this message translates to:
  /// **'Online'**
  String get onlineEvent;

  /// No description provided for @seminar.
  ///
  /// In en, this message translates to:
  /// **'Seminar'**
  String get seminar;

  /// No description provided for @workshop.
  ///
  /// In en, this message translates to:
  /// **'Workshop'**
  String get workshop;

  /// No description provided for @conference.
  ///
  /// In en, this message translates to:
  /// **'Conference'**
  String get conference;

  /// No description provided for @webinar.
  ///
  /// In en, this message translates to:
  /// **'Webinar'**
  String get webinar;

  /// No description provided for @news.
  ///
  /// In en, this message translates to:
  /// **'News'**
  String get news;

  /// No description provided for @noNews.
  ///
  /// In en, this message translates to:
  /// **'No news found.'**
  String get noNews;

  /// No description provided for @institutional.
  ///
  /// In en, this message translates to:
  /// **'Institutional'**
  String get institutional;

  /// No description provided for @media.
  ///
  /// In en, this message translates to:
  /// **'Media'**
  String get media;

  /// No description provided for @external.
  ///
  /// In en, this message translates to:
  /// **'External'**
  String get external;

  /// No description provided for @searchTitle.
  ///
  /// In en, this message translates to:
  /// **'Search NISER'**
  String get searchTitle;

  /// No description provided for @searchHint.
  ///
  /// In en, this message translates to:
  /// **'Publications, researchers, insights…'**
  String get searchHint;

  /// No description provided for @recentSearches.
  ///
  /// In en, this message translates to:
  /// **'Recent searches'**
  String get recentSearches;

  /// No description provided for @clearRecent.
  ///
  /// In en, this message translates to:
  /// **'Clear recent'**
  String get clearRecent;

  /// No description provided for @closeSearch.
  ///
  /// In en, this message translates to:
  /// **'Close search'**
  String get closeSearch;

  /// No description provided for @clearSearch.
  ///
  /// In en, this message translates to:
  /// **'Clear search'**
  String get clearSearch;

  /// No description provided for @searchResults.
  ///
  /// In en, this message translates to:
  /// **'Search results'**
  String get searchResults;

  /// No description provided for @allContent.
  ///
  /// In en, this message translates to:
  /// **'All content'**
  String get allContent;

  /// No description provided for @onlyPublications.
  ///
  /// In en, this message translates to:
  /// **'Publications only'**
  String get onlyPublications;

  /// No description provided for @onlyResearchers.
  ///
  /// In en, this message translates to:
  /// **'Researchers only'**
  String get onlyResearchers;

  /// No description provided for @onlyInsights.
  ///
  /// In en, this message translates to:
  /// **'Insights only'**
  String get onlyInsights;

  /// No description provided for @onlyEvents.
  ///
  /// In en, this message translates to:
  /// **'Events only'**
  String get onlyEvents;

  /// No description provided for @onlyNews.
  ///
  /// In en, this message translates to:
  /// **'News only'**
  String get onlyNews;

  /// No description provided for @chatTitle.
  ///
  /// In en, this message translates to:
  /// **'Ask NISER'**
  String get chatTitle;

  /// No description provided for @chatHint.
  ///
  /// In en, this message translates to:
  /// **'Ask about NISER research…'**
  String get chatHint;

  /// No description provided for @chatSend.
  ///
  /// In en, this message translates to:
  /// **'Send'**
  String get chatSend;

  /// No description provided for @clearSession.
  ///
  /// In en, this message translates to:
  /// **'Clear session'**
  String get clearSession;

  /// No description provided for @chatWelcome.
  ///
  /// In en, this message translates to:
  /// **'Ask me about NISER research, publications and events.'**
  String get chatWelcome;

  /// No description provided for @chatThinking.
  ///
  /// In en, this message translates to:
  /// **'NISER is thinking…'**
  String get chatThinking;

  /// No description provided for @chatSources.
  ///
  /// In en, this message translates to:
  /// **'Sources'**
  String get chatSources;

  /// No description provided for @chatEmpty.
  ///
  /// In en, this message translates to:
  /// **'No messages yet — start the conversation.'**
  String get chatEmpty;

  /// No description provided for @chatHistoryCleared.
  ///
  /// In en, this message translates to:
  /// **'Conversation cleared'**
  String get chatHistoryCleared;

  /// No description provided for @chatFailed.
  ///
  /// In en, this message translates to:
  /// **'Sorry, I could not respond right now. Please try again.'**
  String get chatFailed;

  /// No description provided for @subscribe.
  ///
  /// In en, this message translates to:
  /// **'Newsletter'**
  String get subscribe;

  /// No description provided for @subscribeTitle.
  ///
  /// In en, this message translates to:
  /// **'Subscribe to NISER updates'**
  String get subscribeTitle;

  /// No description provided for @subscribeEmail.
  ///
  /// In en, this message translates to:
  /// **'Email address'**
  String get subscribeEmail;

  /// No description provided for @subscribeName.
  ///
  /// In en, this message translates to:
  /// **'Your name (optional)'**
  String get subscribeName;

  /// No description provided for @subscribeConsent.
  ///
  /// In en, this message translates to:
  /// **'I consent to receiving email updates from NISER. I can unsubscribe at any time.'**
  String get subscribeConsent;

  /// No description provided for @newsletter.
  ///
  /// In en, this message translates to:
  /// **'Newsletter'**
  String get newsletter;

  /// No description provided for @subscribeSuccess.
  ///
  /// In en, this message translates to:
  /// **'You are subscribed! Check your inbox for a confirmation.'**
  String get subscribeSuccess;

  /// No description provided for @subscribeError.
  ///
  /// In en, this message translates to:
  /// **'We could not subscribe you right now. Please try again later.'**
  String get subscribeError;

  /// No description provided for @subscribing.
  ///
  /// In en, this message translates to:
  /// **'Subscribing…'**
  String get subscribing;

  /// No description provided for @invalidEmail.
  ///
  /// In en, this message translates to:
  /// **'Please enter a valid email address.'**
  String get invalidEmail;

  /// No description provided for @contactUs.
  ///
  /// In en, this message translates to:
  /// **'Contact us'**
  String get contactUs;

  /// No description provided for @contactTitle.
  ///
  /// In en, this message translates to:
  /// **'Send NISER a message'**
  String get contactTitle;

  /// No description provided for @contactFirstName.
  ///
  /// In en, this message translates to:
  /// **'First name'**
  String get contactFirstName;

  /// No description provided for @contactLastName.
  ///
  /// In en, this message translates to:
  /// **'Last name'**
  String get contactLastName;

  /// No description provided for @contactOrganization.
  ///
  /// In en, this message translates to:
  /// **'Organization (optional)'**
  String get contactOrganization;

  /// No description provided for @contactEmail.
  ///
  /// In en, this message translates to:
  /// **'Email'**
  String get contactEmail;

  /// No description provided for @contactSubject.
  ///
  /// In en, this message translates to:
  /// **'Subject'**
  String get contactSubject;

  /// No description provided for @contactMessage.
  ///
  /// In en, this message translates to:
  /// **'Your message'**
  String get contactMessage;

  /// No description provided for @contactMessageHint.
  ///
  /// In en, this message translates to:
  /// **'Please write at least 20 characters…'**
  String get contactMessageHint;

  /// No description provided for @sendMessage.
  ///
  /// In en, this message translates to:
  /// **'Send message'**
  String get sendMessage;

  /// No description provided for @sending.
  ///
  /// In en, this message translates to:
  /// **'Sending…'**
  String get sending;

  /// No description provided for @contactSuccess.
  ///
  /// In en, this message translates to:
  /// **'Thank you — your message has been sent. We will respond shortly.'**
  String get contactSuccess;

  /// No description provided for @contactError.
  ///
  /// In en, this message translates to:
  /// **'We could not send your message right now. Please email info@niser.gov.ng.'**
  String get contactError;

  /// No description provided for @subjectGeneral.
  ///
  /// In en, this message translates to:
  /// **'General enquiry'**
  String get subjectGeneral;

  /// No description provided for @subjectPublications.
  ///
  /// In en, this message translates to:
  /// **'Publications'**
  String get subjectPublications;

  /// No description provided for @subjectResearch.
  ///
  /// In en, this message translates to:
  /// **'Research collaboration'**
  String get subjectResearch;

  /// No description provided for @subjectData.
  ///
  /// In en, this message translates to:
  /// **'Open data'**
  String get subjectData;

  /// No description provided for @subjectOther.
  ///
  /// In en, this message translates to:
  /// **'Other'**
  String get subjectOther;

  /// No description provided for @fillRequiredFields.
  ///
  /// In en, this message translates to:
  /// **'Please complete the required fields.'**
  String get fillRequiredFields;

  /// No description provided for @translate.
  ///
  /// In en, this message translates to:
  /// **'Translate'**
  String get translate;

  /// No description provided for @translateTitle.
  ///
  /// In en, this message translates to:
  /// **'Translate to Nigerian languages'**
  String get translateTitle;

  /// No description provided for @translateSource.
  ///
  /// In en, this message translates to:
  /// **'Enter text to translate…'**
  String get translateSource;

  /// No description provided for @translateResult.
  ///
  /// In en, this message translates to:
  /// **'Translation'**
  String get translateResult;

  /// No description provided for @translateButton.
  ///
  /// In en, this message translates to:
  /// **'Translate'**
  String get translateButton;

  /// No description provided for @translating.
  ///
  /// In en, this message translates to:
  /// **'Translating…'**
  String get translating;

  /// No description provided for @translateError.
  ///
  /// In en, this message translates to:
  /// **'Translation is unavailable right now.'**
  String get translateError;

  /// No description provided for @selectTargetLanguage.
  ///
  /// In en, this message translates to:
  /// **'Choose a language'**
  String get selectTargetLanguage;

  /// No description provided for @yoruba.
  ///
  /// In en, this message translates to:
  /// **'Yorùbá'**
  String get yoruba;

  /// No description provided for @hausa.
  ///
  /// In en, this message translates to:
  /// **'Hausa'**
  String get hausa;

  /// No description provided for @igbo.
  ///
  /// In en, this message translates to:
  /// **'Igbo'**
  String get igbo;

  /// No description provided for @copyTranslation.
  ///
  /// In en, this message translates to:
  /// **'Copy translation'**
  String get copyTranslation;

  /// No description provided for @openData.
  ///
  /// In en, this message translates to:
  /// **'Open data'**
  String get openData;

  /// No description provided for @noDatasets.
  ///
  /// In en, this message translates to:
  /// **'No datasets available yet.'**
  String get noDatasets;

  /// No description provided for @datasetDetail.
  ///
  /// In en, this message translates to:
  /// **'Dataset'**
  String get datasetDetail;

  /// No description provided for @resources.
  ///
  /// In en, this message translates to:
  /// **'Resources'**
  String get resources;

  /// No description provided for @noResources.
  ///
  /// In en, this message translates to:
  /// **'No resources available for this dataset.'**
  String get noResources;

  /// No description provided for @download.
  ///
  /// In en, this message translates to:
  /// **'Download'**
  String get download;

  /// No description provided for @rows.
  ///
  /// In en, this message translates to:
  /// **'rows'**
  String get rows;

  /// No description provided for @license.
  ///
  /// In en, this message translates to:
  /// **'License'**
  String get license;

  /// No description provided for @organizationLabel.
  ///
  /// In en, this message translates to:
  /// **'Organization'**
  String get organizationLabel;

  /// No description provided for @updatedLabel.
  ///
  /// In en, this message translates to:
  /// **'Updated'**
  String get updatedLabel;

  /// No description provided for @authorLabel.
  ///
  /// In en, this message translates to:
  /// **'Author'**
  String get authorLabel;

  /// No description provided for @maintainerLabel.
  ///
  /// In en, this message translates to:
  /// **'Maintainer'**
  String get maintainerLabel;

  /// No description provided for @datasetMetadata.
  ///
  /// In en, this message translates to:
  /// **'Metadata'**
  String get datasetMetadata;

  /// No description provided for @noMetadata.
  ///
  /// In en, this message translates to:
  /// **'No metadata available.'**
  String get noMetadata;

  /// No description provided for @dataCatalogue.
  ///
  /// In en, this message translates to:
  /// **'Open data'**
  String get dataCatalogue;

  /// No description provided for @chatConsent.
  ///
  /// In en, this message translates to:
  /// **'Conversations are used to improve answers. You can clear your session at any time.'**
  String get chatConsent;

  /// No description provided for @notificationPrefs.
  ///
  /// In en, this message translates to:
  /// **'Notification preferences'**
  String get notificationPrefs;

  /// No description provided for @enableNotifications.
  ///
  /// In en, this message translates to:
  /// **'Enable notifications'**
  String get enableNotifications;

  /// No description provided for @notificationsSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Receive push alerts for new publications, events and rapid response briefs.'**
  String get notificationsSubtitle;

  /// No description provided for @notificationTopics.
  ///
  /// In en, this message translates to:
  /// **'Topics'**
  String get notificationTopics;

  /// No description provided for @topicPublications.
  ///
  /// In en, this message translates to:
  /// **'New publications'**
  String get topicPublications;

  /// No description provided for @topicInsights.
  ///
  /// In en, this message translates to:
  /// **'Insights & analysis'**
  String get topicInsights;

  /// No description provided for @topicEvents.
  ///
  /// In en, this message translates to:
  /// **'Events & webinars'**
  String get topicEvents;

  /// No description provided for @topicRapidResponse.
  ///
  /// In en, this message translates to:
  /// **'Rapid response briefs'**
  String get topicRapidResponse;

  /// No description provided for @notificationsPrivacy.
  ///
  /// In en, this message translates to:
  /// **'Notifications are delivered by Firebase Cloud Messaging. You can change these preferences at any time.'**
  String get notificationsPrivacy;

  /// No description provided for @notificationsDenied.
  ///
  /// In en, this message translates to:
  /// **'Notifications are blocked. Enable them in system settings to receive alerts.'**
  String get notificationsDenied;

  /// No description provided for @policyAlerts.
  ///
  /// In en, this message translates to:
  /// **'Notifications'**
  String get policyAlerts;

  /// No description provided for @markAllRead.
  ///
  /// In en, this message translates to:
  /// **'Mark all read'**
  String get markAllRead;

  /// No description provided for @noNotifications.
  ///
  /// In en, this message translates to:
  /// **'No notifications yet.'**
  String get noNotifications;

  /// No description provided for @timeNow.
  ///
  /// In en, this message translates to:
  /// **'Just now'**
  String get timeNow;

  /// No description provided for @contentLanguage.
  ///
  /// In en, this message translates to:
  /// **'Preferred content language'**
  String get contentLanguage;

  /// No description provided for @contentLanguageSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Sets the app interface language and the default target for translations.'**
  String get contentLanguageSubtitle;

  /// No description provided for @appearance.
  ///
  /// In en, this message translates to:
  /// **'Appearance'**
  String get appearance;

  /// No description provided for @appearanceSubtitle.
  ///
  /// In en, this message translates to:
  /// **'Choose light, dark, or follow your device setting.'**
  String get appearanceSubtitle;

  /// No description provided for @themeSystem.
  ///
  /// In en, this message translates to:
  /// **'System'**
  String get themeSystem;

  /// No description provided for @themeLight.
  ///
  /// In en, this message translates to:
  /// **'Light'**
  String get themeLight;

  /// No description provided for @themeDark.
  ///
  /// In en, this message translates to:
  /// **'Dark'**
  String get themeDark;

  /// No description provided for @savedForOffline.
  ///
  /// In en, this message translates to:
  /// **'Saved for offline'**
  String get savedForOffline;

  /// No description provided for @itemsCount.
  ///
  /// In en, this message translates to:
  /// **'{count} items'**
  String itemsCount(int count);

  /// No description provided for @read.
  ///
  /// In en, this message translates to:
  /// **'Read'**
  String get read;

  /// No description provided for @removeFromDevice.
  ///
  /// In en, this message translates to:
  /// **'Remove from device'**
  String get removeFromDevice;

  /// No description provided for @downloadingPdf.
  ///
  /// In en, this message translates to:
  /// **'Downloading… {percent}%'**
  String downloadingPdf(int percent);

  /// No description provided for @downloadFailed.
  ///
  /// In en, this message translates to:
  /// **'Download failed. Check your connection.'**
  String get downloadFailed;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'ha', 'ig', 'yo'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'ha':
      return AppLocalizationsHa();
    case 'ig':
      return AppLocalizationsIg();
    case 'yo':
      return AppLocalizationsYo();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
