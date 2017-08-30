﻿//
// This file demonstrates how to initialize EGL in a Windows Store app, using ICoreWindow.
//

#include "pch.h"
#include <WindowsNumerics.h>

using namespace Windows::ApplicationModel::Core;
using namespace Platform;
using namespace HologramJS;

void RunSimple()
{
    // Run a basic HoloJS app
    auto holoJsAppSource = ref new HoloJsAppSource(ref new String(L"http://holojs.azurewebsites.net/fbxloader/app.json"));
    CoreApplication::Run(holoJsAppSource);
}

void RunWithOptions()
{
    // Run with some custom options for the app

    // 1. Create the app and set the options
    auto holoJsAppView = ref new HoloJsAppView(ref new String(L"http://holojs.azurewebsites.net/fbxloader/app.json"));
    holoJsAppView->ImageStabilizationEnabled = false;
    holoJsAppView->WorldOriginRelativePosition = Windows::Foundation::Numerics::float3(0, 0, -2);

    // 2. Create the source from the app and run it
    auto holoJsAppSource = ref new HoloJsAppSource(holoJsAppView);
    CoreApplication::Run(holoJsAppSource);
}

// The main function creates an IFrameworkViewSource for our app, and runs the app.
[Platform::MTAThread]
int main(Array<Platform::String^>^)
{
    // RunSimple();
    RunWithOptions();
	return 0;
}