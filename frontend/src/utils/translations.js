export const translations = {
    en: {
        nav: {
            brand: "Agrimate AI",
            connected: "Connected",
            language: "English"
        },
        home: {
            heroTitle: "Agrimate AI Agent",
            heroSubtitle: "Your intelligent farming assistant.",
            inputPlaceholder: "Ask about weather, market prices, or farming advice...",
            cards: {
                weather: { title: "Weather", subtitle: "Rain likely" },
                yield: { title: "Yield Predictor", subtitle: "Harvest forecast" },
                crop: { title: "Crop Recommendation", subtitle: "Best planting" },
                disease: { title: "Disease Doctor", subtitle: "AI Diagnosis" }
            }
        },
        crop: {
            title: "Agrimate Advisor",
            greeting: "Hello! I'm your Agrimate Advisor. 🌱 I can help you find the best crop for your land. First, what is your **soil type**? (e.g., Red, Black, Alluvial)",
            steps: {
                soil: "First, what is your **soil type**?",
                landSize: "Great. How large is your land in **acres**?",
                season: "Got it. Which **season** are you planting in?",
                irrigation: "What kind of **irrigation** do you have available?",
                state: "Which **State** is your farm located in?",
                district: "And the **District**?",
                previousCrop: "Almost done. What did you grow previously?"
            },
            options: {
                soil: ['Alluvial', 'Black', 'Red', 'Clay', 'Sandy'],
                season: ['Kharif', 'Rabi', 'Zaid'],
                irrigation: ['Well', 'Canal', 'Tube Well', 'Rainfed'],
                detect: "📍 Detect Location"
            }
        },
        yield: {
            title: "Yield Expert",
            greeting: "Hello! I'm your Yield Expert. 📈 Let's estimate your harvest. First, **which crop** are you planning to grow?",
            steps: {
                cropName: "First, **which crop** are you planning to grow?",
                landSize: "How large is the area in **acres**?",
                soil: "What is the **soil type**?",
                irrigation: "How is the water availability?",
                fertilizer: "What fertilizer will you primarily use?",
                season: "Which **season** is this for?",
                location: "Finally, where is your farm located (State)?"
            },
            options: {
                cropName: ['Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'],
                landSize: ['1 Acre', '2.5 Acres', '5 Acres', '10 Acres'],
                soil: ['Alluvial', 'Clay', 'Loamy', 'Black', 'Sandy'],
                irrigation: ['Sufficient', 'Moderate', 'Rainfed', 'Scarce'],
                fertilizer: ['Urea', 'DAP', 'NPK', 'Organic'],
                season: ['Kharif', 'Rabi', 'Zaid', 'Whole Year'],
                location: ['📍 Detect Location', 'Punjab', 'Haryana', 'UP', 'MP']
            }
        },
        disease: {
            title: "Plant Doctor",
            greeting: "Hello! I'm your Plant Doctor. 🚑 Let's diagnose the issue. Which **crop** is affected?",
            steps: {
                cropName: "Which **crop** is affected?",
                symptoms: "Please describe the **symptoms** you see.",
                days: "How many **days** ago did you first notice this?",
                weather: "What have the **weather conditions** been like recently?",
                fertilizer: "Have you applied any **fertilizer or pesticide** recently?"
            },
            options: {
                cropName: ['Tomato', 'Potato', 'Corn', 'Rice', 'Wheat'],
                symptoms: ['Yellow leaves', 'Brown spots', 'White powder', 'Wilting', 'Curled leaves'],
                days: ['Today', '1-2 days ago', '1 week ago', '> 2 weeks'],
                weather: ['Humid', 'Rainy', 'Dry/Hot', 'Cold'],
                fertilizer: ['None', 'Urea', 'NPK', 'Fungicide']
            }
        }
    },
    hi: {
        nav: {
            brand: "एग्रीमेट एआई",
            connected: "जुड़ा हुआ",
            language: "हिन्दी"
        },
        home: {
            heroTitle: "एग्रीमेट एआई एजेंट",
            heroSubtitle: "आपका बुद्धिमान कृषि सहायक।",
            inputPlaceholder: "मौसम, बाजार भाव या खेती की सलाह के बारे में पूछें...",
            cards: {
                weather: { title: "मौसम", subtitle: "बारिश की संभावना" },
                yield: { title: "उपज अनुमान", subtitle: "फसल पूर्वानुमान" },
                crop: { title: "फसल सुझाव", subtitle: "सर्वोत्तम बुवाई" },
                disease: { title: "रोग चिकित्सक", subtitle: "एआई निदान" }
            }
        },
        crop: {
            title: "एग्रीमेट सलाहकार",
            greeting: "नमस्ते! मैं आपका एग्रीमेट सलाहकार हूँ। 🌱 मैं आपको अपनी भूमि के लिए सबसे अच्छी फसल खोजने में मदद कर सकता हूँ। सबसे पहले, आपकी **मिट्टी का प्रकार** क्या है?",
            steps: {
                soil: "सबसे पहले, आपकी **मिट्टी का प्रकार** क्या है?",
                landSize: "बढ़िया। आपकी जमीन कितने **एकड़** में है?",
                season: "समझ गया। आप किस **मौसम** में बुवाई कर रहे हैं?",
                irrigation: "आपके पास किस तरह की **सिंचाई** उपलब्ध है?",
                state: "आपका खेत किस **राज्य** में है?",
                district: "और **जिला**?",
                previousCrop: "लगभग हो गया। आपने पिछली बार क्या उगाया था?"
            },
            options: {
                soil: ['जलोढ़', 'काली', 'लाल', 'चिकनी', 'रेतीली'],
                season: ['खरीफ', 'रबी', 'ज़ैद'],
                irrigation: ['कुआँ', 'नहर', 'ट्यूबवेल', 'वर्षा सिंचित'],
                detect: "📍 स्थान का पता लगाएं"
            }
        },
        yield: {
            title: "उपज विशेषज्ञ",
            greeting: "नमस्ते! मैं आपका उपज विशेषज्ञ हूँ। 📈 आइए आपकी फसल का अनुमान लगाते हैं। सबसे पहले, आप **कौन सी फसल** उगाने की योजना बना रहे हैं?",
            steps: {
                cropName: "सबसे पहले, आप **कौन सी फसल** उगाने की योजना बना रहे हैं?",
                landSize: "**एकड़** में रकबा कितना बड़ा है?",
                soil: "**मिट्टी का प्रकार** क्या है?",
                irrigation: "पानी की उपलब्धता कैसी है?",
                fertilizer: "आप मुख्य रूप से किस उर्वरक का उपयोग करेंगे?",
                season: "यह किस **मौसम** के लिए है?",
                location: "अंत में, आपका खेत कहाँ स्थित है (राज्य)?"
            },
            options: {
                cropName: ['गेहूँ', 'चावल', 'मक्का', 'सोयाबीन', 'कपास'],
                landSize: ['1 एकड़', '2.5 एकड़', '5 एकड़', '10 एकड़'],
                soil: ['जलोढ़', 'चिकनी', 'दोमट', 'काली', 'रेतीली'],
                irrigation: ['पर्याप्त', 'मध्यम', 'वर्षा आधारित', 'कम'],
                fertilizer: ['यूरिया', 'डीएपी', 'एनपीके', 'जैविक'],
                season: ['खरीफ', 'रबी', 'ज़ैद', 'पूरा साल'],
                location: ['📍 स्थान का पता लगाएं', 'पंजाब', 'हरियाणा', 'यूपी', 'एमपी']
            }
        },
        disease: {
            title: "पौधा चिकित्सक",
            greeting: "नमस्ते! मैं आपका पौधा चिकित्सक हूँ। 🚑 आइए समस्या का निदान करते हैं। कौन सी **फसल** प्रभावित है?",
            steps: {
                cropName: "कौन सी **फसल** प्रभावित है?",
                symptoms: "कृपया जो **लक्षण** आप देख रहे हैं उनका वर्णन करें।",
                days: "आपने इसे पहली बार कितने **दिन** पहले देखा था?",
                weather: "हाल ही में **मौसम की स्थिति** कैसी रही है?",
                fertilizer: "क्या आपने हाल ही में कोई **उर्वरक या कीटनाशक** डाला है?"
            },
            options: {
                cropName: ['टमाटर', 'आलू', 'मक्का', 'चावल', 'गेहूँ'],
                symptoms: ['पीले पत्ते', 'भूरे धब्बे', 'सफेद पाउडर', 'मुरझाना', 'मुड़े हुए पत्ते'],
                days: ['आज', '1-2 दिन पहले', '1 सप्ताह पहले', '> 2 सप्ताह'],
                weather: ['आर्द्र', 'बरसात', 'सुखा/गर्म', 'ठंडा'],
                fertilizer: ['कोई नहीं', 'यूरिया', 'एनपीके', 'फफूंदनाशक']
            }
        }
    },
    mr: {
        nav: {
            brand: "अॅग्रीमेट एआय",
            connected: "जोडलेले",
            language: "मराठी"
        },
        home: {
            heroTitle: "अॅग्रीमेट एआय एजंट",
            heroSubtitle: "माझा हुशार शेती सहाय्यक.",
            inputPlaceholder: "हवामान, बाजारभाव किंवा शेतीविषयक सल्ल्याबद्दल विचारा...",
            cards: {
                weather: { title: "हवामान", subtitle: "पावसाची शक्यता" },
                yield: { title: "उत्पन्न अंदाज", subtitle: "पीक अंदाज" },
                crop: { title: "पीक शिफारस", subtitle: "सर्वोत्तम लागवड" },
                disease: { title: "रोग डॉक्टर", subtitle: "एआई निदान" }
            }
        },
        crop: {
            title: "अॅग्रीमेट सल्लागार",
            greeting: "नमस्कार! मी आपला अॅग्रीमेट सल्लागार आहे. 🌱 मी तुम्हाला तुमच्या जमिनीसाठी सर्वोत्तम पीक शोधण्यात मदत करू शकतो. प्रथम, तुमच्या **मातीचा प्रकार** काय आहे?",
            steps: {
                soil: "प्रथम, तुमच्या **मातीचा प्रकार** काय आहे?",
                landSize: "छान. तुमची जमीन किती **एकर** आहे?",
                season: "समजले. तुम्ही कोणत्या **ह हंगामात** लागवड करत आहात?",
                irrigation: "तुमच्याकडे कोणत्या प्रकारचे **सिंचन** उपलब्ध आहे?",
                state: "तुमचे शेत कोणत्या **राज्यात** आहे?",
                district: "आणि **जिल्हा**?",
                previousCrop: "झालंच. तुम्ही यापूर्वी कोणते पीक घेतले होते?"
            },
            options: {
                soil: ['गाळाची', 'काळी', 'लाल', 'चिकण माती', 'वालुकामय'],
                season: ['खरीप', 'रब्बी', 'उन्हाळी'],
                irrigation: ['विहीर', 'कालवा', 'बोअरवेल', 'पावसावर आधारित'],
                detect: "📍 स्थान शोधा"
            }
        },
        yield: {
            title: "उत्पन्न तज्ञ",
            greeting: "नमस्कार! मी तुमचा उत्पन्न तज्ञ आहे. 📈 चला तुमच्या पिकाचा अंदाज लावूया. प्रथम, तुम्ही **कोणते पीक** घेण्याचा विचार करत आहात?",
            steps: {
                cropName: "प्रथम, तुम्ही **कोणते पीक** घेण्याचा विचार करत आहात?",
                landSize: "**एकर** मध्ये क्षेत्रफळ किती आहे?",
                soil: "**मातीचा प्रकार** काय आहे?",
                irrigation: "पाण्याची उपलब्धता कशी आहे?",
                fertilizer: "तुम्ही प्रामुख्याने कोणते खत वापरणार आहात?",
                season: "हा कोणता **हंगाम** आहे?",
                location: "शेवटी, तुमचे शेत कुठे आहे (राज्य)?"
            },
            options: {
                cropName: ['गहू', 'तांदूळ', 'मका', 'सोयाबीन', 'कापूस'],
                landSize: ['1 एकर', '2.5 एकर', '5 एकर', '10 एकर'],
                soil: ['गाळाची', 'चिकण माती', 'पोयटा', 'काळी', 'वालुकामय'],
                irrigation: ['पुरेशी', 'मध्यम', 'पावसावर आधारित', 'दुर्मिळ'],
                fertilizer: ['युरिया', 'DAP', 'NPK', 'सेंद्रिय'],
                season: ['खरीप', 'रब्बी', 'उन्हाळी', 'पूर्ण वर्ष'],
                location: ['📍 स्थान शोधा', 'पंजाब', 'हरियाणा', 'यूपी', 'एमपी']
            }
        },
        disease: {
            title: "वनस्पती डॉक्टर",
            greeting: "नमस्कार! मी तुमचा वनस्पती डॉक्टर आहे. 🚑 चला समस्येचे निदान करूया. कोणते **पीक** प्रभावित आहे?",
            steps: {
                cropName: "कोणते **पीक** प्रभावित आहे?",
                symptoms: "कृपया तुम्हाला दिसत असलेल्या **लक्षणे** सांगा.",
                days: "तुम्ही हे किती **दिवसांपूर्वी** पहिल्यांदा पाहिले?",
                weather: "अलीकडे **हवामान** कसे होते?",
                fertilizer: "तुम्ही अलीकडे कोणतेही **खत किंवा कीटकनाशक** वापरले आहे का?"
            },
            options: {
                cropName: ['टोमॅटो', 'बटाटा', 'मका', 'तांदूळ', 'गहू'],
                symptoms: ['पिवळी पाने', 'तपकिरी डाग', 'पांढरी पावडर', 'कोमेजणे', 'वाकलेली पाने'],
                days: ['आज', '1-2 दिवसांपूर्वी', '1 आठवड्यापूर्वी', '> 2 आठवडे'],
                weather: ['दमट', 'पावसाळी', 'कोरडे/गरम', 'थंड'],
                fertilizer: ['काहीही नाही', 'युरिया', 'NPK', 'बुरशीनाशक']
            }
        }
    }
};
